import request from "supertest-session";
import assert from "assert";
import { Express } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, disconnect } from "mongoose";

import User from "../src/models/user";
import createApp from "../src/app";
import { dummy } from "./dummy";

describe("user ", function () {
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

  it("PUT /p success", async () => {
    const user = await dummy();
    const newData = await dummy({ save: false });
    const session = request(app);
    await session.post("/login").send(user.client);
    const res = await session.put("/p").send(newData.client);
    assert.equal(res.body.msg, "update user success");
    assert.equal(await User.countDocuments(newData.filter).exec(), 1);
    assert.equal(await User.countDocuments({}).exec(), 1);
  });

  it("PUT /p success (no update)", async () => {
    const user = await dummy();
    const session = request(app);
    await session.post("/login").send(user.client);
    const res = await session.put("/p");
    assert.equal(res.body.msg, "update user success");
    assert.equal(await User.countDocuments(user.filter).exec(), 1);
  });

  it("PUT /p failure (phone number taken)", async () => {
    const user1 = await dummy();
    const user2 = await dummy();
    const session = request(app);
    await session.post("/login").send(user1.client);
    const res = await session.put("/p").send({ phone: user2.client.phone });
    assert.equal(res.body.msg, "update user failure (phone taken)");
    assert.equal(await User.countDocuments(user1.filter).exec(), 1);
  });

  it("GET /p/get success", async () => {
    const user = await dummy();
    const session = request(app);
    await session.post("/login").send(user.client);
    const res = await session.get("/p/get");
    assert.equal(res.body.phone, user.client.phone);
    assert.equal(res.body.name, user.client.name);
  });

  it("PUT /p/* failure (not logged in)", async () => {
    const res1 = await request(app).put("/p").expect(401);
    const res2 = await request(app).get("/p/get").expect(401);
    assert.equal(res1.body.msg, "authentication failure");
    assert.equal(res2.body.msg, "authentication failure");
  });
});
