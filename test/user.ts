import request from "supertest";
import assert from "assert";
import User from "../src/models/user";
import App from "../src/app";

import { genUserData } from "./helpers";

describe("user ", () => {
  it("POST /user/new success", async () => {
    const testUser = await genUserData();
    const res = await request(App)
      .post("/user/new")
      .send(testUser.withPassword);
    assert.equal(res.body.msg, "create user success");
    assert.equal(await User.countDocuments(testUser.withNeither).exec(), 1);
  });

  it("POST /user/new failure (duplicate phone)", async () => {
    const testUser1 = await genUserData();
    const testUser2 = await genUserData();
    testUser2.withPassword.phone = testUser1.withPassword.phone;
    await request(App).post("/user/new").send(testUser1.withPassword);
    const res = await request(App)
      .post("/user/new")
      .send(testUser2.withPassword);
    assert.equal(res.body.msg, "create user failure: duplicate user");
    assert.equal(await User.countDocuments({}).exec(), 1);
  });
});
