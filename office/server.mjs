#!/usr/bin/env node
// agents-know office: live viewer server. Zero dependencies, Node >= 18.
// Serves exactly two routes on 127.0.0.1: "/" (the office page) and "/events"
// (Server-Sent Events that follow a run's feed.md). Reads feed.md and, for the
// company mode line only, brief.md. Nothing else on disk is ever read.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = '127.0.0.1';
const BASE_PORT = 4747;
const POLL_MS = 400;
const RUN_RE = /^[A-Za-z0-9._-]+$/;
const MODES = ['startup', 'standard', 'bigtech', 'hardcore'];
const PAGE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'prototype.html');

const runsRoot = () => path.join(os.homedir(), '.agents-know', 'runs');
const realRoot = () => { try { return fs.realpathSync(runsRoot()); } catch { return null; } };
const inside = (root, p) => p.startsWith(root + path.sep);

// Resolve a run directory. runId null means "follow latest".
// Returns { dir, id } or null (no such run) or throws {status} for invalid input.
export function resolveRun(runId) {
  const root = realRoot();
  if (runId !== null) {
    if (!RUN_RE.test(runId) || runId === '.' || runId === '..') throw { status: 400 };
    if (!root) return null;
    const cand = path.resolve(root, runId);
    if (!inside(root, cand)) throw { status: 400 };
    try {
      const real = fs.realpathSync(cand);
      if (!inside(root, real) || !fs.statSync(real).isDirectory()) return null;
      return { dir: real, id: runId };
    } catch { return null; }
  }
  if (!root) return null;
  try {
    const real = fs.realpathSync(path.join(root, 'latest'));
    if (!inside(root, real) || !fs.statSync(real).isDirectory()) return null;
    return { dir: real, id: path.basename(real) };
  } catch { return null; }
}

function readMode(dir) {
  try {
    const file = fs.realpathSync(path.join(dir, 'brief.md'));
    if (!inside(realRoot() ?? '', file)) return null;
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const at = lines.findIndex((l) => /^##\s+company mode\s*$/i.test(l));
    if (at < 0) return null;
    for (const l of lines.slice(at + 1)) {
      if (/^##/.test(l)) break;
      const m = MODES.find((x) => new RegExp('\\b' + x + '\\b', 'i').test(l));
      if (m) return m;
    }
  } catch { /* no brief */ }
  return null;
}

function send(res, event, data) {
  res.write(`event: ${event}\ndata: ${data}\n\n`);
}

function follow(req, res, fixedRun) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'X-Content-Type-Options': 'nosniff',
    Connection: 'keep-alive',
  });
  res.write('retry: 1500\n\n');
  const current = resolveRun(fixedRun);
  let fd = null, pos = 0, buf = '', watcher = null, announced = false, closed = false, histDone = false;
  const endHistory = () => { if (!histDone) { histDone = true; send(res, 'history-end', '{}'); } };
  const id = current ? current.id : null;

  const finish = () => {
    if (closed) return;
    closed = true;
    clearInterval(timer);
    try { watcher?.close(); } catch {}
    if (fd !== null) try { fs.closeSync(fd); } catch {}
    try { res.end(); } catch {}
  };
  const reset = () => { send(res, 'reset', '{}'); finish(); };

  const open = () => {
    const feed = path.join(current.dir, 'feed.md');
    try {
      const real = fs.realpathSync(feed);
      if (!inside(realRoot() ?? '', real)) return;
      fd = fs.openSync(real, 'r');
      try { watcher = fs.watch(real, () => tick()); watcher.on('error', () => {}); } catch {}
    } catch { /* not there yet; polling retries */ }
  };

  const tick = () => {
    if (closed) return;
    if (fixedRun === null) {
      const now = resolveRun(null);
      if ((now ? now.id : null) !== id) return reset();
    }
    if (!current) { if (resolveRun(fixedRun)) reset(); return; }
    if (!announced) {
      announced = true;
      send(res, 'meta', JSON.stringify({ run: current.id, mode: readMode(current.dir) }));
    }
    if (fd === null) open();
    if (fd === null) return endHistory();
    let size;
    try { size = fs.fstatSync(fd).size; } catch { return reset(); }
    if (size < pos) return reset();
    while (pos < size) {
      const chunk = Buffer.alloc(Math.min(size - pos, 1 << 20));
      const n = fs.readSync(fd, chunk, 0, chunk.length, pos);
      if (n <= 0) break;
      pos += n;
      buf += chunk.toString('utf8', 0, n);
    }
    const parts = buf.split('\n');
    buf = parts.pop();
    for (const l of parts) if (l.trim()) send(res, 'line', l.replace(/\r$/, ''));
    endHistory();
  };

  if (!current) send(res, 'empty', '{}');
  const timer = setInterval(() => {
    tick();
    if (!closed) res.write(': ping\n\n');
  }, POLL_MS);
  req.on('close', finish);
  tick();
}

export function createServer(defaultRun = null) {
  const server = http.createServer((req, res) => {
    let url;
    try { url = new URL(req.url, 'http://x'); } catch { res.writeHead(400).end(); return; }
    // DNS-rebinding guard: only accept loopback Host headers.
    const host = (req.headers.host || '').replace(/:\d+$/, '');
    if (host !== '127.0.0.1' && host !== 'localhost') { res.writeHead(403).end('forbidden'); return; }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
    if (url.pathname === '/') {
      let html;
      try { html = fs.readFileSync(PAGE); } catch { res.writeHead(500).end('page missing'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : html);
      return;
    }
    if (url.pathname === '/events') {
      const q = url.searchParams.get('run');
      const run = q !== null && q !== '' ? q : defaultRun;
      try { resolveRun(run); } catch (e) { res.writeHead(e.status || 400, { 'Content-Type': 'text/plain' }).end('bad run id'); return; }
      follow(req, res, run);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found');
  });
  return server;
}

export function listen(server, base = BASE_PORT) {
  return new Promise((resolve, reject) => {
    let port = base;
    const attempt = () => {
      server.once('error', (e) => {
        if (e.code === 'EADDRINUSE' && port < base + 100) { port++; attempt(); } else reject(e);
      });
      server.listen(port, HOST, () => resolve(port));
    };
    attempt();
  });
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  const arg = process.argv[2] ?? null;
  if (arg !== null && (!RUN_RE.test(arg) || arg === '.' || arg === '..')) {
    console.error('invalid run id: use letters, digits, dot, underscore or dash');
    process.exit(2);
  }
  const server = createServer(arg);
  const port = await listen(server);
  console.log(`agents-know office: http://${HOST}:${port}/${arg ? '?run=' + encodeURIComponent(arg) : ''}`);
  console.log('Press Ctrl+C to stop.');
  const stop = () => {
    server.close(() => process.exit(0));
    server.closeAllConnections?.();
    setTimeout(() => process.exit(0), 500).unref();
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
