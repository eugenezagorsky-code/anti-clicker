import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = path.join(root, ".next");
const cssDir = path.join(nextDir, "static/css/app");
const lockFile = path.join(nextDir, ".dev-server.lock");

function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function isCacheCorrupt() {
  if (!fs.existsSync(nextDir)) {
    return false;
  }
  if (!fs.existsSync(cssDir)) {
    return true;
  }
  try {
    return fs.readdirSync(cssDir).length === 0;
  } catch {
    return true;
  }
}

function clearCorruptCache() {
  if (!isCacheCorrupt()) {
    return;
  }
  console.warn("[dev] Corrupted .next cache detected (CSS assets missing). Clearing...");
  fs.rmSync(nextDir, { recursive: true, force: true });
}

function readLock() {
  if (!fs.existsSync(lockFile)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(lockFile, "utf8"));
  } catch {
    return null;
  }
}

function removeLock() {
  fs.rmSync(lockFile, { force: true });
}

function assertSingleDevServer() {
  const lock = readLock();
  if (!lock || lock.cwd !== root) {
    return;
  }
  if (isProcessAlive(lock.pid)) {
    console.error(
      `[dev] Another dev server is already running for this project (pid ${lock.pid}).`,
    );
    console.error(`[dev] Stop it first, then run npm run dev again.`);
    process.exit(1);
  }
  removeLock();
}

clearCorruptCache();
fs.mkdirSync(nextDir, { recursive: true });
assertSingleDevServer();

const child = spawn("npx", ["next", "dev"], {
  cwd: root,
  stdio: "inherit",
});

child.on("spawn", () => {
  fs.writeFileSync(
    lockFile,
    JSON.stringify({ pid: child.pid, cwd: root, startedAt: Date.now() }),
  );
});

const cleanup = () => {
  removeLock();
};

child.on("exit", (code) => {
  cleanup();
  process.exit(code ?? 0);
});

process.on("SIGINT", () => {
  child.kill("SIGINT");
});

process.on("SIGTERM", () => {
  child.kill("SIGTERM");
});
