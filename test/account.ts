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
    const testUser = await genUserData();
    await new User(testUser.withHash).save();
    const res = await request(App).post("/login").send(testUser.withPassword);
    assert.equal(res.body.msg, "login success");
  });

  it("POST /login failure (empty body)", async () => {
    const testUser = await genUserData();
    await new User(testUser.withHash).save();
    await request(App).post("/login").expect(302).expect("Location", "/fail");
  });

  it("POST /login failure (wrong password)", async () => {
    let testUser = await genUserData();
    await new User(testUser.withHash).save();
    testUser.withPassword.password = crypto.randomBytes(20).toString("hex");
    await request(App)
      .post("/login")
      .send(testUser.withPassword)
      .expect(302)
      .expect("Location", "/fail");
  });

  it("POST /login failure (no such user)", async () => {
    let testUser = await genUserData();
    await new User(testUser.withHash).save();
    testUser.withPassword.phone = crypto.randomBytes(20).toString("hex");
    await request(App)
      .post("/login")
      .send(testUser.withPassword)
      .expect(302)
      .expect("Location", "/fail");
  });

  it("POST /login failure (no such user)", async () => {
    let testUser = await genUserData();
    await new User(testUser.withHash).save();
    testUser.withPassword.phone = crypto.randomBytes(20).toString("hex");
    await request(App)
      .post("/login")
      .send(testUser.withPassword)
      .expect(302)
      .expect("Location", "/fail");
  });
});
