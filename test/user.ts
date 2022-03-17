import request from "supertest";
import assert from "assert";
import User from "../src/models/user";
import App from "../src/app";

import { genUserData } from "./helpers";

describe("user ", function () {
  it("POST /user/new success", async () => {
    const testUser = await genUserData();
    const res = await request(App)
      .post("/user/new")
      .send(testUser.withPassword);
    assert.equal("create user success", res.body.msg);
    assert.equal(1, await User.countDocuments(testUser.withNeither).exec());
  });

  it("POST /user/new failure (duplicate phone)", async () => {
    const testUser1 = await genUserData();
    const testUser2 = await genUserData();
    testUser2.withPassword.phone = testUser1.withPassword.phone;
    await request(App).post("/user/new").send(testUser1.withPassword);
    const res = await request(App)
      .post("/user/new")
      .send(testUser2.withPassword);
    assert.equal("create user failure: duplicate user", res.body.msg);
    assert.equal(1, await User.countDocuments({}).exec());
  });
});
