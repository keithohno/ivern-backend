import request from "supertest-session";
import assert from "assert";
import crypto from "crypto";

import User from "../src/models/user";
import App from "./app";
import { dummy } from "./dummy";

describe("user ", () => {
  it("POST /user/new success", async () => {
    const user = await dummy();
    const res = await request(App).post("/user/new").send(user.client);
    assert.equal(res.body.msg, "create user success");
    assert.equal(await User.countDocuments(user.filter).exec(), 1);
  });

  it("POST /user/new failure (duplicate phone)", async () => {
    const user1 = await dummy();
    const user2 = await dummy();
    user2.client.phone = user1.client.phone;
    await request(App).post("/user/new").send(user1.client);
    const res = await request(App).post("/user/new").send(user2.client);
    assert.equal(res.body.msg, "create user failure: duplicate user");
    assert.equal(await User.countDocuments({}).exec(), 1);
  });

  it("PUT /user/:phone success", async () => {
    const user = await dummy();
    const newData = await dummy();
    await new User(user.db).save();
    const session = request(App);
    await session.post("/login").send(user.client);
    const res = await session
      .put(`/user/${user.client.phone}`)
      .send(newData.client);
    assert.equal(res.body.msg, "update user success");
    assert.equal(await User.countDocuments(newData.filter).exec(), 1);
    assert.equal(await User.countDocuments({}).exec(), 1);
  });

  it("PUT /user/:phone success (no update)", async () => {
    const user = await dummy();
    await new User(user.db).save();
    const session = request(App);
    await session.post("/login").send(user.client);
    const res = await session.put(`/user/${user.client.phone}`);
    assert.equal(res.body.msg, "update user success");
    assert.equal(await User.countDocuments(user.filter).exec(), 1);
  });

  it("PUT /user/:phone failure (phone number taken)", async () => {
    const user1 = await dummy();
    const user2 = await dummy();
    await new User(user1.db).save();
    await new User(user2.db).save();
    const session = request(App);
    await session.post("/login").send(user1.client);
    const res = await session
      .put(`/user/${user1.client.phone}`)
      .send({ phone: user2.client.phone });
    assert.equal(res.body.msg, "update user failure (phone taken)");
    assert.equal(await User.countDocuments(user1.filter).exec(), 1);
  });

  it("PUT /user/:phone failure (not logged in)", async () => {
    const user = await dummy();
    const res = await request(App).put(`/user/${user.client.phone}`);
    assert.equal(res.body.msg, "authentication failure (not logged in)");
  });

  it("PUT /user/:phone failure (wrong user)", async () => {
    const user = await dummy();
    await new User(user.db).save();
    const session = request(App);
    await session.post("/login").send(user.client);
    const res = await session.put(
      `/user/${crypto.randomBytes(20).toString("hex")}`
    );
    assert.equal(res.body.msg, "authentication failure (wrong user)");
  });
});
