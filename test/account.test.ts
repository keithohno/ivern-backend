import request from "supertest-session";
import assert from "assert";
import User from "../src/models/user";
import crypto from "crypto";

import App from "./app";
import { dummy } from "./dummy";

describe("passport", () => {
  it("GET /fail", async () => {
    const res = await request(App).get("/fail");
    assert.equal(res.body.msg, "login failure");
  });

  it("POST /login success", async () => {
    const user = await dummy();
    await new User(user.db).save();
    const res = await request(App).post("/login").send(user.client);
    assert.equal(res.body.msg, "login success");
  });

  it("POST /login failure (empty body)", async () => {
    const user = await dummy();
    await new User(user.db).save();
    await request(App).post("/login").expect(302).expect("Location", "/fail");
  });

  it("POST /login failure (wrong password)", async () => {
    let user = await dummy();
    await new User(user.db).save();
    user.client.password = crypto.randomBytes(20).toString("hex");
    await request(App)
      .post("/login")
      .send(user.client)
      .expect(302)
      .expect("Location", "/fail");
  });

  it("POST /login failure (no such user)", async () => {
    let user = await dummy();
    await request(App)
      .post("/login")
      .send(user.client)
      .expect(302)
      .expect("Location", "/fail");
  });
});
