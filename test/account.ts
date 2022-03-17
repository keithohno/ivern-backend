import request from "supertest";
import assert from "assert";
import User from "../src/models/user";
import App from "../src/app";
import crypto from "crypto";

import { genUserData } from "./helpers";

describe("passport", () => {
  it("GET /fail", async () => {
    const res = await request(App).get("/fail");
    assert.equal(res.body.msg, "login failure");
  });

  it("POST /login success", async () => {
    const user = await genUserData();
    await new User(user.db).save();
    const res = await request(App).post("/login").send(user.client);
    assert.equal(res.body.msg, "login success");
  });

  it("POST /login failure (empty body)", async () => {
    const user = await genUserData();
    await new User(user.db).save();
    await request(App).post("/login").expect(302).expect("Location", "/fail");
  });

  it("POST /login failure (wrong password)", async () => {
    let user = await genUserData();
    await new User(user.db).save();
    user.client.password = crypto.randomBytes(20).toString("hex");
    await request(App)
      .post("/login")
      .send(user.client)
      .expect(302)
      .expect("Location", "/fail");
  });

  it("POST /login failure (no such user)", async () => {
    let user = await genUserData();
    await request(App)
      .post("/login")
      .send(user.client)
      .expect(302)
      .expect("Location", "/fail");
  });
});
