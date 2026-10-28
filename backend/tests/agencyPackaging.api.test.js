import "./helpers/testEnv.js";

import test, { before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import User from "../src/models/User.js";
import Studio from "../src/models/Studio.js";
import TalentAgency from "../src/models/TalentAgency.js";
import env from "../src/config/envConfig.js";

let mongod;
let server;
let baseUrl;
let authToken;
let studioId;

before(async () => {
  mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongod.getUri());

  const user = await User.create({
    username: "agency_executive_user",
    email: "agency_exec@cineverse.com",
    password: "Password123!",
  });

  const studio = await Studio.create({
    owner: user._id,
    name: "Apex Pictures",
    money: 20000000,
    prestige: 60,
  });

  studioId = studio._id;

  authToken = jwt.sign(
    { userId: user._id, studioId: studio._id },
    env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );

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

test("GET /api/talent-agencies seeds and returns all 4 major Hollywood agencies", async () => {
  const res = await fetch(`${baseUrl}/api/talent-agencies`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.length, 4);

  const agencyNames = body.data.map((a) => a.agencyName);
  assert.ok(agencyNames.includes("Creative Artists Agency"));
  assert.ok(agencyNames.includes("William Morris Endeavor"));
  assert.ok(agencyNames.includes("United Talent Agency"));
  assert.ok(agencyNames.includes("Gersh Agency"));
});

test("GET /api/talent-agencies/available-packages returns packaged talent bundles", async () => {
  const res = await fetch(`${baseUrl}/api/talent-agencies/available-packages`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.ok(body.data.length >= 4);

  const firstPackage = body.data[0];
  assert.ok(firstPackage.id);
  assert.ok(firstPackage.finalPrice > 0);
  assert.ok(firstPackage.synergyBonus);
});

test("POST /api/talent-agencies/package successfully signs a package and deducts money", async () => {
  const initialStudio = await Studio.findById(studioId);
  const initialMoney = initialStudio.money;

  const res = await fetch(`${baseUrl}/api/talent-agencies/package`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agencyName: "Creative Artists Agency",
      packageValue: 5000000,
      talentCount: 3,
    }),
  });

  assert.strictEqual(res.status, 201);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.ok(body.data.costInfo);
  assert.ok(body.data.costInfo.finalPrice < 5000000); // discount applied

  const updatedStudio = await Studio.findById(studioId);
  assert.strictEqual(updatedStudio.money, initialMoney - body.data.costInfo.finalPrice);

  const agency = await TalentAgency.findOne({ studioId, agencyName: "Creative Artists Agency" });
  assert.strictEqual(agency.packagedDealsCount, 1);
  assert.strictEqual(agency.relationshipScore, 55); // incremented by 5
});

test("POST /api/talent-agencies/package rejects deal when studio money is insufficient", async () => {
  const res = await fetch(`${baseUrl}/api/talent-agencies/package`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agencyName: "William Morris Endeavor",
      packageValue: 999000000, // exceeds studio balance
      talentCount: 2,
    }),
  });

  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.success, false);
  assert.match(body.message, /insufficient/i);
});
