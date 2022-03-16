import { MongoMemoryServer } from "mongodb-memory-server";
import { connect } from "mongoose";
import User from "../src/models/user";
import assert from "assert";

describe("drivers/user", function () {
  var mongod: MongoMemoryServer;
  this.beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connect(uri);
  });

  this.beforeEach(async () => {
    await User.deleteMany({});
  });

  this.afterAll(async () => {
    await mongod.stop();
  });
});
