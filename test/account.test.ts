import request from "supertest-session";
import assert from "assert";
import crypto from "crypto";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, disconnect } from "mongoose";
import { Server } from "http";

import App from "./app";
import User from "../src/models/user";
import { dummy } from "./dummy";

describe("passport", function () {
  var mongod: MongoMemoryServer;
  var server: Server;

  this.beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connect(uri);
    server = App.listen(5000);
  });

  this.afterAll(async () => {
    await mongod.stop();
    disconnect();
    server.close();
  });

  this.beforeEach(async () => {
    await User.deleteMany({});
  });

  it("POST /signup success", async () => {
    const user = await dummy();
    const res = await request(App).post("/signup").send(user.client);
    assert.equal(res.body.msg, "create user success");
    assert.equal(await User.countDocuments(user.filter).exec(), 1);
  });

  it("POST /signup failure (duplicate phone)", async () => {
    const user = await dummy();
    user.save();
    const res = await request(App).post("/signup").send(user.client);
    assert.equal(res.body.msg, "create user failure: duplicate user");
    assert.equal(await User.countDocuments({}).exec(), 1);
  });

  it("POST /login success", async () => {
    const user = await dummy();
    user.save();
    const res = await request(App).post("/login").send(user.client);
    assert.equal(res.body.msg, "login success");
  });

  it("POST /login failure (empty body)", async () => {
    const user = await dummy();
    user.save();
    await request(App).post("/login").expect(400);
  });

  it("POST /login failure (wrong password)", async () => {
    let user = await dummy();
    user.save();
    user.client.password = crypto.randomBytes(20).toString("hex");
    await request(App).post("/login").send(user.client).expect(401);
  });

  it("POST /login failure (no such user)", async () => {
    let user = await dummy();
    await request(App).post("/login").send(user.client).expect(401);
  });
});
