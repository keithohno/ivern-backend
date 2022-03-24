import request from "supertest-session";
import assert from "assert";
import crypto from "crypto";
import { Express } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, disconnect } from "mongoose";

import createApp from "../src/app";
import User from "../src/models/user";
import { dummy } from "./dummy";

describe("passport", function () {
  var mongod: MongoMemoryServer;
  var app: Express;

  this.beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connect(uri);
    app = createApp();
  });

  this.afterAll(async () => {
    await mongod.stop();
    disconnect();
  });

  this.beforeEach(async () => {
    await User.deleteMany({});
  });

  it("POST /signup success", async () => {
    const user = await dummy({ save: false });
    const res = await request(app).post("/signup").send(user.client);
    assert.equal(res.body.msg, "create user success");
    assert.equal(await User.countDocuments(user.filter).exec(), 1);
  });

  it("POST /signup failure (duplicate phone)", async () => {
    const user = await dummy();
    const res = await request(app)
      .post("/signup")
      .send(user.client)
      .expect(400);
    assert.equal(res.body.msg, "create user failure: duplicate user");
    assert.equal(await User.countDocuments({}).exec(), 1);
  });

  it("POST /login success", async () => {
    const user = await dummy();
    const res = await request(app).post("/login").send(user.client);
    assert.equal(res.body.msg, "login success");
  });

  it("POST /login failure (empty body)", async () => {
    const user = await dummy();
    await request(app).post("/login").expect(400);
  });

  it("POST /login failure (wrong password)", async () => {
    let user = await dummy();
    user.client.password = crypto.randomBytes(20).toString("hex");
    await request(app).post("/login").send(user.client).expect(401);
  });

  it("POST /login failure (no such user)", async () => {
    let user = await dummy({ save: false });
    await request(app).post("/login").send(user.client).expect(401);
  });
});
