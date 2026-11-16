#!/usr/bin/env node
import { mkdir, readFile, rename, rmdir, stat, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";

const DIR = process.env.AGENTS_KNOW_BACKLOG_DIR || join(homedir(), ".agents-know", "backlog");
const DEFAULT_PROFILE = process.env.AGENTS_KNOW_PROFILE || "default";
const TYPES = ["bug", "feature", "improve"];
const AREAS = ["fe", "be", "design", "full"];
const STATUSES = ["backlog", "doing", "decision", "done"];
const EDITABLE = ["title", "note", "type", "area", "status", "rank", "pm", "answer", "branch", "run"];
const LOCK_WAIT_MS = 3000;
const LOCK_STALE_MS = 15000;

const str = (description, extra = {}) => ({ type: "string", description, ...extra });
const PROFILE = str("agents-know profile name, e.g. my-app. Each profile has its own backlog file.", { pattern: "^[a-z0-9][a-z0-9_-]{0,63}$" });
const FIELDS = {
  title: str("Short title", { maxLength: 200 }),
  note: str("Details from the user", { maxLength: 4000 }),
  type: str("bug, feature or improve", { enum: TYPES }),
  area: str("fe, be, design or full", { enum: AREAS }),
  status: str("backlog, doing, decision (waiting for the user's answer) or done", { enum: STATUSES }),
  rank: { type: ["integer", "null"], minimum: 1, description: "PM priority, 1 is the most important" },
  pm: str("PM note: the reason for the rank, the question for the user in decision, or the result in done", { maxLength: 4000 }),
  answer: str("The user's answer to the PM's question", { maxLength: 4000 }),
  branch: str("Git branch of the work", { maxLength: 200 }),
  run: str("agents-know run id that handles the task", { maxLength: 200 }),
};

const TOOLS = [
  {
    name: "backlog_list",
    description: "List the tasks of a profile's backlog. Pass status to get only that column.",
    inputSchema: { type: "object", properties: { profile: PROFILE, status: FIELDS.status }, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: "backlog_add",
    description: "Add a task to a profile's backlog.",
    inputSchema: {
      type: "object",
      properties: { profile: PROFILE, title: FIELDS.title, note: FIELDS.note, type: FIELDS.type, area: FIELDS.area },
      required: ["title", "type", "area"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false },
  },
  {
    name: "backlog_update",
    description: "Change fields of a task. Only the fields given change.",
    inputSchema: {
      type: "object",
      properties: { profile: PROFILE, id: str("Task id"), ...FIELDS },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false },
  },
  {
    name: "backlog_delete",
    description: "Remove a task from a profile's backlog.",
    inputSchema: { type: "object", properties: { profile: PROFILE, id: str("Task id") }, required: ["id"], additionalProperties: false },
    annotations: { readOnlyHint: false, destructiveHint: true },
  },
];

class InputError extends Error {}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fileOf(profile = DEFAULT_PROFILE) {
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(profile)) throw new InputError("profile: lowercase letters, digits, - and _ only");
  return join(DIR, `${profile}.json`);
}

async function withLock(file, work) {
  await mkdir(DIR, { recursive: true });
  const lock = `${file}.lock`;
  const started = Date.now();
  for (;;) {
    try {
      await mkdir(lock);
      break;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      const age = await stat(lock).then((info) => Date.now() - info.mtimeMs, () => 0);
      if (age > LOCK_STALE_MS) await rmdir(lock).catch(() => {});
      else if (Date.now() - started > LOCK_WAIT_MS) throw new Error("backlog is busy, try again");
      else await sleep(50);
    }
  }
  try {
    return await work();
  } finally {
    await rmdir(lock).catch(() => {});
  }
}

async function load(file) {
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    return { version: 1, tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [] };
  } catch (error) {
    if (error.code === "ENOENT") return { version: 1, tasks: [] };
    throw error;
  }
}

async function save(file, data) {
  const temp = `${file}.${process.pid}.tmp`;
  await writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await rename(temp, file);
}

function validate(fields) {
  const clean = {};
  for (const key of EDITABLE) {
    if (!(key in fields)) continue;
    const value = fields[key];
    if (key === "rank") {
      if (value !== null && !(Number.isInteger(value) && value >= 1)) throw new InputError("rank: a positive integer or null");
    } else if (typeof value !== "string") {
      throw new InputError(`${key}: must be text`);
    }
    if (key === "type" && !TYPES.includes(value)) throw new InputError(`type: ${TYPES.join(", ")}`);
    if (key === "area" && !AREAS.includes(value)) throw new InputError(`area: ${AREAS.join(", ")}`);
    if (key === "status" && !STATUSES.includes(value)) throw new InputError(`status: ${STATUSES.join(", ")}`);
    clean[key] = typeof value === "string" ? value.trim() : value;
  }
  if ("title" in clean && !clean.title) throw new InputError("title: cannot be empty");
  return clean;
}

const handlers = {
  async backlog_list({ profile, status }) {
    const { tasks } = await load(fileOf(profile));
    return { tasks: status ? tasks.filter((task) => task.status === status) : tasks };
  },
  async backlog_add({ profile, ...input }) {
    const file = fileOf(profile);
    const fields = validate(input);
    if (!fields.title || !fields.type || !fields.area) throw new InputError("title, type and area are required");
    return withLock(file, async () => {
      const data = await load(file);
      const now = Date.now();
      const task = {
        id: `t${now.toString(36)}${randomBytes(3).toString("hex")}`,
        title: fields.title,
        note: fields.note || "",
        type: fields.type,
        area: fields.area,
        status: "backlog",
        rank: null,
        pm: "",
        answer: "",
        branch: "",
        run: "",
        createdAt: now,
        updatedAt: now,
      };
      data.tasks.push(task);
      await save(file, data);
      return { task };
    });
  },
  async backlog_update({ profile, id, ...input }) {
    const file = fileOf(profile);
    const fields = validate(input);
    return withLock(file, async () => {
      const data = await load(file);
      const task = data.tasks.find((item) => item.id === id);
      if (!task) throw new InputError(`no task with id ${id}`);
      Object.assign(task, fields, { updatedAt: Date.now() });
      await save(file, data);
      return { task };
    });
  },
  async backlog_delete({ profile, id }) {
    const file = fileOf(profile);
    return withLock(file, async () => {
      const data = await load(file);
      const kept = data.tasks.filter((item) => item.id !== id);
      if (kept.length === data.tasks.length) throw new InputError(`no task with id ${id}`);
      await save(file, { ...data, tasks: kept });
      return { deleted: id };
    });
  },
};

const send = (message) => process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`);

async function dispatch({ id, method, params }) {
  if (id === undefined) return;
  if (method === "initialize") {
    return send({
      id,
      result: {
        protocolVersion: params?.protocolVersion || "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "agents-know-backlog", version: "1.0.0" },
      },
    });
  }
  if (method === "ping") return send({ id, result: {} });
  if (method === "tools/list") return send({ id, result: { tools: TOOLS } });
  if (method !== "tools/call") return send({ id, error: { code: -32601, message: `unknown method ${method}` } });
  const handler = handlers[params?.name];
  if (!handler) return send({ id, error: { code: -32602, message: `unknown tool ${params?.name}` } });
  try {
    const result = await handler(params.arguments || {});
    send({ id, result: { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result } });
  } catch (error) {
    const text = error instanceof InputError ? error.message : `backlog file could not be read or written: ${error.message}`;
    send({ id, result: { content: [{ type: "text", text }], isError: true } });
  }
}

let chain = Promise.resolve();
createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return;
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return send({ id: null, error: { code: -32700, message: "invalid JSON" } });
  }
  chain = chain.then(() => dispatch(message)).catch((error) => send({ id: message.id ?? null, error: { code: -32603, message: error.message } }));
});
