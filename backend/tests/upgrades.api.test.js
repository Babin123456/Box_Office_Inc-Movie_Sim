import "./helpers/testEnv.js";

import test, { before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Studio from "../src/models/Studio.js";

// ---------------------------------------------------------------------------
// Integration tests for the studio upgrades endpoint, verifying that the
// balance deduction uses an atomic MongoDB update (`findOneAndUpdate` with
// `$inc` + `$gte` guard) instead of a read-modify-write pattern. This
// prevents race conditions where concurrent requests could both see a
// sufficient balance and double-spend.
// ---------------------------------------------------------------------------

const TEST_PASSWORD = ["test", "Pw", "8842"].join("-");

let mongod;
let server;
let baseUrl;

const registerStudio = async (id = Math.random().toString(36).substring(7)) => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: `player_${id}`,
      email: `p1_${id}@example.com`,
      password: TEST_PASSWORD,
      studioName: `P1 Studios_${id}`,
    }),
  });
  return res.json();
};

before(async () => {
  mongod = await MongoMemoryServer.create();
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

test("POST /api/upgrades/buy — deducts funds atomically and awards prestige", async () => {
  const { token, studio } = await registerStudio("deduct-test");
  assert.ok(token);
  assert.strictEqual(studio.money, 10000000);

  // Buy the cheapest upgrade ($1,500,000 for advanced_cameras)
  const res = await fetch(`${baseUrl}/api/upgrades/buy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ upgradeId: "advanced_cameras" }),
  });
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.studioMoney, 10000000 - 1500000);

  // Verify the persisted balance and prestige
  const fresh = await Studio.findById(studio._id).lean();
  assert.strictEqual(fresh.money, 10000000 - 1500000);
  assert.strictEqual(fresh.prestige, 25, "prestige should be incremented by 25");
});

test("POST /api/upgrades/buy — rejects duplicate upgrade purchase", async () => {
  const { token } = await registerStudio("dup-test");

  const buy = async (upgradeId) =>
    fetch(`${baseUrl}/api/upgrades/buy`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ upgradeId }),
    });

  // First purchase succeeds
  const res1 = await buy("marketing_partnership");
  assert.strictEqual(res1.status, 200);

  // Duplicate purchase fails with 400
  const res2 = await buy("marketing_partnership");
  assert.strictEqual(res2.status, 400);
  const body = await res2.json();
  assert.strictEqual(body.success, false);
  assert.ok(
    body.message.toLowerCase().includes("already active") ||
    body.message.toLowerCase().includes("already purchased"),
    `expected duplicate message, got: ${body.message}`,
  );
});

test("POST /api/upgrades/buy — rejects purchase when funds are insufficient", async () => {
  const { token } = await registerStudio("poor-test");

  // Artificially lower the studio balance to below any upgrade cost
  const meRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const me = await meRes.json();
  await Studio.updateOne(
    { owner: me.user._id },
    { $set: { money: 100000 } },
  );

  // Even the cheapest upgrade ($1,500,000) should now fail
  const res = await fetch(`${baseUrl}/api/upgrades/buy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ upgradeId: "advanced_cameras" }),
  });
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.success, false);
  assert.ok(
    body.message.toLowerCase().includes("insufficient") ||
    body.message.toLowerCase().includes("fund"),
    `expected insufficient-funds message, got: ${body.message}`,
  );
});

test("POST /api/upgrades/buy — concurrent purchases do not produce negative balance", async () => {
  const { token } = await registerStudio("concur-test");

  // Set balance to exactly enough for ONE upgrade ($1,500,000)
  const meRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const me = await meRes.json();
  await Studio.updateOne(
    { owner: me.user._id },
    { $set: { money: 1500000, prestige: 0 } },
  );

  // Fire two concurrent purchase requests for the same upgrade
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const [res1, res2] = await Promise.all([
    fetch(`${baseUrl}/api/upgrades/buy`, {
      method: "POST",
      headers,
      body: JSON.stringify({ upgradeId: "advanced_cameras" }),
    }),
    fetch(`${baseUrl}/api/upgrades/buy`, {
      method: "POST",
      headers,
      body: JSON.stringify({ upgradeId: "advanced_cameras" }),
    }),
  ]);

  const body1 = await res1.json();
  const body2 = await res2.json();

  // Exactly one must succeed, the other must fail (or both fail)
  const succeeded = [body1, body2].filter((b) => b.success === true).length;
  const failed = [body1, body2].filter((b) => b.success === false).length;
  assert.strictEqual(succeeded, 1, "exactly one concurrent purchase should succeed");
  assert.strictEqual(failed, 1, "the other concurrent purchase should fail");

  // The studio balance must not be negative
  const fresh = await Studio.findOne({ owner: me.user._id }).lean();
  assert.ok(
    fresh.money >= 0,
    `studio balance must not be negative, got ${fresh.money}`,
  );
  assert.strictEqual(
    fresh.money,
    0,
    `studio balance should be exactly 0 after spending all on one upgrade, got ${fresh.money}`,
  );
});
