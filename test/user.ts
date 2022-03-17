import request from "supertest";
import assert from "assert";
import User from "../src/models/user";
import App from "../src/app";

import { genUserData } from "./helpers";

describe("user ", () => {
  it("POST /user/new success", async () => {
    const user = await genUserData();
    const res = await request(App).post("/user/new").send(user.client);
    assert.equal(res.body.msg, "create user success");
    assert.equal(await User.countDocuments(user.filter).exec(), 1);
  });

  it("POST /user/new failure (duplicate phone)", async () => {
    const user1 = await genUserData();
    const user2 = await genUserData();
    user2.client.phone = user1.client.phone;
    await request(App).post("/user/new").send(user1.client);
    const res = await request(App).post("/user/new").send(user2.client);
    assert.equal(res.body.msg, "create user failure: duplicate user");
    assert.equal(await User.countDocuments({}).exec(), 1);
  });
});
