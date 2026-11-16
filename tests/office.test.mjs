import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const server = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'office', 'server.mjs');
let home, feed, child, base, port;

const get = (p, opts = {}) => new Promise((resolve, reject) => {
  http.get({ host: '127.0.0.1', port, path: p, ...opts }, (res) => {
    let body = ''; res.setEncoding('utf8');
    res.on('data', (d) => (body += d)); res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
  }).on('error', reject);
});

// Open an SSE stream; waitFor resolves once the received text contains a needle.
function stream(p) {
  let text = ''; let req;
  const waiters = [];
  const ready = new Promise((resolve, reject) => {
    req = http.get({ host: '127.0.0.1', port, path: p }, (res) => {
      res.setEncoding('utf8');
      res.on('data', (d) => { text += d; waiters.slice().forEach((w) => w()); });
      resolve(res);
    }).on('error', reject);
  });
  const waitFor = (needle, ms = 5000) => new Promise((resolve, reject) => {
    const check = () => { if (text.includes(needle)) { clearTimeout(t); waiters.splice(waiters.indexOf(check), 1); resolve(text); } };
    const t = setTimeout(() => reject(new Error(`timeout waiting for ${needle}; got: ${text}`)), ms);
    waiters.push(check); check();
  });
  return { ready, waitFor, close: () => req.destroy(), text: () => text };
}

before(async () => {
  home = fs.mkdtempSync(path.join(os.tmpdir(), 'ak-office-'));
  const run = path.join(home, '.agents-know', 'runs', '2026-01-01-demo');
  fs.mkdirSync(run, { recursive: true });
  feed = path.join(run, 'feed.md');
  fs.writeFileSync(feed, '10:00:00  pm                       Started: demo run\n10:00:05  agents-know:qa  [pass:frontend-engineer] ok\n');
  fs.writeFileSync(path.join(run, 'brief.md'), '# Brief\n\n## Company mode\nhardcore\n');
  fs.symlinkSync(run, path.join(home, '.agents-know', 'runs', 'latest'));
  const childEnv = Object.assign({}, process['env'], { HOME: home, USERPROFILE: home });
  child = spawn(process.execPath, [server], { env: childEnv, stdio: ['ignore', 'pipe', 'inherit'] });
  const url = await new Promise((resolve, reject) => {
    let out = '';
    child.stdout.on('data', (d) => { out += d; const m = out.match(/http:\/\/127\.0\.0\.1:(\d+)\//); if (m) resolve(m[0]); });
    child.on('exit', (c) => reject(new Error('server exited ' + c)));
  });
  base = url; port = +new URL(url).port;
});

after(() => { child?.kill('SIGINT'); fs.rmSync(home, { recursive: true, force: true }); });

test('/ serves the office page', async () => {
  const r = await get('/');
  assert.equal(r.status, 200);
  assert.match(r.headers['content-type'], /text\/html/);
  assert.match(r.body, /<canvas/);
});

test('other paths are 404, bad run ids are 400', async () => {
  assert.equal((await get('/../../etc/passwd')).status, 404);
  assert.equal((await get('/x')).status, 404);
  assert.equal((await get('/prototype.html')).status, 404);
  assert.equal((await get('/events?run=../x')).status, 400);
  assert.equal((await get('/events?run=..')).status, 400);
});

test('foreign Host header is refused', async () => {
  assert.equal((await get('/', { headers: { Host: 'evil.example' } })).status, 403);
});

test('/events streams history, mode, and appended lines', async () => {
  const s = stream('/events');
  await s.ready;
  await s.waitFor('event: history-end');
  const t = s.text();
  assert.match(t, /event: meta\ndata: .*"run":"2026-01-01-demo".*"mode":"hardcore"/);
  assert.match(t, /event: line\ndata: 10:00:00  pm .*Started: demo run/);
  assert.match(t, /agents-know:qa/);
  fs.appendFileSync(feed, '10:00:09  skeptic  Finding: new line\n');
  await s.waitFor('data: 10:00:09  skeptic  Finding: new line');
  s.close();
});

test('explicit run id works and an unknown run reports empty', async () => {
  const a = stream('/events?run=2026-01-01-demo');
  await a.ready; await a.waitFor('Started: demo run'); a.close();
  const b = stream('/events?run=nope');
  await b.ready; await b.waitFor('event: empty'); b.close();
});

test('listens on 127.0.0.1 only', async () => {
  assert.match(base, /^http:\/\/127\.0\.0\.1:/);
  const external = Object.values(os.networkInterfaces()).flat().find((i) => i && i.family === 'IPv4' && !i.internal);
  if (!external) return;
  await new Promise((resolve, reject) => {
    const sock = net.connect({ host: external.address, port }, () => { sock.destroy(); reject(new Error('reachable on ' + external.address)); });
    sock.on('error', () => resolve());
  });
});
