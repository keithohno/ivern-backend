import { MongoMemoryServer } from "mongodb-memory-server";
import * as userDriver from "../../src/drivers/user";
import { connect } from "mongoose";

import assert from "assert";

const USER1 = { name: "alice", phone: "111-222-3333" };
const USER2 = { name: "bob", phone: "111-222-4444" };

describe("drivers/user", function () {
  var mongod: MongoMemoryServer;
  this.beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connect(uri);
  });

  this.beforeEach(async () => {
    await userDriver.clear();
  });

  this.afterAll(async () => {
    await mongod.stop();
  });

  it("should insert correctly", async () => {
    await userDriver.insert(USER1);
    assert.notEqual(null, await userDriver.find(USER1));
    assert.equal(1, await userDriver.count());
  });

  it("should update correctly", async () => {
    await userDriver.insert(USER1);
    await userDriver.update(USER1, USER2);
    assert.notEqual(null, await userDriver.find({ USER2 }));
    assert.equal(null, await userDriver.find(USER1));
    assert.equal(1, await userDriver.count());
  });

  it("should count documents correctly", async () => {
    await userDriver.insert(USER1);
    await userDriver.insert(USER2);
    assert.equal(1, await userDriver.count(USER1));
    assert.equal(1, await userDriver.count(USER2));
    assert.equal(2, await userDriver.count({}));
  });

  it("should clear database correctly", async () => {
    assert.equal(0, await userDriver.count());
  });
});
