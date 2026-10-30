import "./helpers/testEnv.js";

import test, { before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

// ---------------------------------------------------------------------------
// Route mounting tests ensuring core service endpoints are wired into app.js
// and respond with expected authentication or success codes rather than 404.
// ---------------------------------------------------------------------------

let mongod;
let server;
let baseUrl;

before(async () => {
  mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongod.getUri());

  const { default: app } = await import("../src/app.js");
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

test("GET /api/tutorial/state is mounted and requires authentication (401, not 404)", async () => {
  const res = await fetch(`${baseUrl}/api/tutorial/state`);
  assert.strictEqual(res.status, 401);
  const body = await res.json();
  assert.strictEqual(body.success, false);
});

test("GET /api/composers/market is mounted and requires authentication (401, not 404)", async () => {
  const res = await fetch(`${baseUrl}/api/composers/market`);
  assert.strictEqual(res.status, 401);
  const body = await res.json();
  assert.strictEqual(body.success, false);
});

test("GET /api/scandals/strategies is mounted and returns public strategy handbook (200)", async () => {
  const res = await fetch(`${baseUrl}/api/scandals/strategies`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.ok(body.data !== undefined);
});

test("GET /api/awards/campaigns is mounted and requires authentication (401, not 404)", async () => {
  const res = await fetch(`${baseUrl}/api/awards/campaigns`);
  assert.strictEqual(res.status, 401);
  const body = await res.json();
  assert.strictEqual(body.success, false);
});

test("GET /api/box-office/regional-summary is mounted and requires authentication (401, not 404)", async () => {
  const res = await fetch(`${baseUrl}/api/box-office/regional-summary`);
  assert.strictEqual(res.status, 401);
  const body = await res.json();
  assert.strictEqual(body.success, false);
});
