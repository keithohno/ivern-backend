import { MongoMemoryServer } from "mongodb-memory-server";
import * as userDriver from "../../src/db/users/driver";
import { connect } from "mongoose";

import assert from "assert";

const NAME1 = "alice";
const NAME2 = "bob";
const PHONE1 = "111-222-3333";
const PHONE2 = "444-555-6666";
const USER1 = { name: NAME1, phone: PHONE1 };
const USER2 = { name: NAME2, phone: PHONE2 };
const USER1a = { name: NAME2, phone: PHONE1 };
const USER1b = { name: NAME1, phone: PHONE2 };

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

  it("should not allow repeated phone numbers", async () => {
    await userDriver.insert(USER1);
    await userDriver.insert(USER1b);
    await assert.rejects(userDriver.insert(USER1a));
  });
});
