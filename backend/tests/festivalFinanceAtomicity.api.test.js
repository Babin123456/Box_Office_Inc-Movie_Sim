import "./helpers/testEnv.js";

import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import User from "../src/models/User.js";
import Studio from "../src/models/Studio.js";
import Movie from "../src/models/Movie.js";
import FestivalSubmission from "../src/models/FestivalSubmission.js";
import env from "../src/config/envConfig.js";

let mongod;
let server;
let baseUrl;
let producerToken;
let producerUser;
let producerStudio;
let homelessToken;
let homelessUser;
let testMovie;

before(async () => {
  mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongod.getUri());

  producerUser = await User.create({
    username: "cannes_auteur",
    email: "auteur@cannes.com",
    password: "Password123!",
  });

  producerStudio = await Studio.create({
    owner: producerUser._id,
    name: "Cannes Auteur Studios",
    money: 1000000, // 10 Lakhs
    prestige: 40,
  });

  testMovie = await Movie.create({
    title: "The Autumn Sonata",
    studioId: producerStudio._id,
    scriptId: "mock-script-id",
    directorId: "mock-director-id",
    leadActorId: "mock-lead-actor-id",
    crewTeamId: "mock-crew-team-id",
    createdWeek: 1,
    status: "RELEASED",
    quality: 92,
    criticScore: 90,
    budget: 2000000,
    genre: "Drama",
  });

  producerToken = jwt.sign(
    { userId: producerUser._id, studioId: producerStudio._id },
    env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );

  homelessUser = await User.create({
    username: "indie_without_studio",
    email: "indie@nostudio.com",
    password: "Password123!",
  });

  homelessToken = jwt.sign(
    { userId: homelessUser._id },
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

test("POST /api/festivals/submit rejects with 404 when user has no studio", async () => {
  const res = await fetch(`${baseUrl}/api/festivals/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${homelessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieId: testMovie._id,
      festivalName: "CANNES",
    }),
  });

  assert.equal(res.status, 404);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.match(body.message, /Studio profile not found/i);

  // Assert no orphaned submission was created
  const submissions = await FestivalSubmission.find({ userId: homelessUser._id });
  assert.equal(submissions.length, 0);
});

test("POST /api/festivals/submit rejects with 400 when studio has insufficient money", async () => {
  producerStudio.money = 100000; // Less than Cannes fee (500,000)
  await producerStudio.save();

  const res = await fetch(`${baseUrl}/api/festivals/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${producerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieId: testMovie._id,
      festivalName: "CANNES",
    }),
  });

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.match(body.message, /Insufficient studio funds/i);

  // Studio money remains unchanged
  const studioAfter = await Studio.findById(producerStudio._id);
  assert.equal(studioAfter.money, 100000);
});

test("POST /api/festivals/submit atomically deducts fee and records submission", async () => {
  producerStudio.money = 2000000;
  await producerStudio.save();

  const res = await fetch(`${baseUrl}/api/festivals/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${producerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieId: testMovie._id,
      festivalName: "CANNES",
    }),
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data._id);
  assert.equal(body.data.festivalName, "CANNES");
  assert.equal(body.data.entryFee, 500000);

  // Verify money was atomically deducted
  const studioAfter = await Studio.findById(producerStudio._id);
  assert.equal(studioAfter.money, 1500000);
});

test("POST /api/festivals/accept-distribution atomically signs contract and credits advance", async () => {
  const submission = await FestivalSubmission.findOne({
    userId: producerUser._id,
    festivalName: "CANNES",
  });
  assert.ok(submission);
  assert.ok(submission.distributionBids.length > 0);

  const selectedBid = submission.distributionBids[0];
  const initialStudioMoney = (await Studio.findById(producerStudio._id)).money;

  const res = await fetch(`${baseUrl}/api/festivals/accept-distribution`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${producerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      submissionId: submission._id,
      distributorName: selectedBid.distributorName,
    }),
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.submission.status, "ACQUIRED");
  assert.equal(body.data.submission.acceptedDeal.distributorName, selectedBid.distributorName);

  // Verify studio funds increased by advancePayment
  const studioAfter = await Studio.findById(producerStudio._id);
  assert.equal(studioAfter.money, initialStudioMoney + selectedBid.advancePayment);
});

test("POST /api/festivals/accept-distribution rejects already acquired submission with 400", async () => {
  const submission = await FestivalSubmission.findOne({
    userId: producerUser._id,
    festivalName: "CANNES",
  });

  const res = await fetch(`${baseUrl}/api/festivals/accept-distribution`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${producerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      submissionId: submission._id,
      distributorName: "Neon",
    }),
  });

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.match(body.message, /already been signed/i);
});
