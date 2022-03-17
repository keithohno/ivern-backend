import { MongoMemoryServer } from "mongodb-memory-server";
import { connect } from "mongoose";
import request from "supertest";
import assert from "assert";
import User from "../src/models/user";
import App from "../src/app";
import crypto from "crypto";
import argon2 from "argon2";

const genUserData = async () => {
  const name = crypto.randomBytes(20).toString("hex");
  const phone = crypto.randomBytes(20).toString("hex");
  const password = crypto.randomBytes(20).toString("hex");
  return {
    withPassword: {
      name: name,
      phone: phone,
      password: password,
    },
    withHash: {
      name: name,
      phone: phone,
      hash: await argon2.hash(password),
    },
    withNeither: {
      name: name,
      phone: phone,
    },
  };
};

describe("passport", function () {
  var mongod: MongoMemoryServer;
  this.beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connect(uri);
    App.listen(5000, () => {
      console.log(`server started at port 5000`);
    });
  });

  this.beforeEach(async () => {
    await User.deleteMany({});
  });

  this.afterAll(async () => {
    await mongod.stop();
  });

  it("GET /fail", async () => {
    const res = await request(App).get("/fail");
    assert.equal("login failure", res.body.msg);
  });

  it("POST /create_user", async () => {
    const testUser = await genUserData();
    const res = await request(App)
      .post("/create_user")
      .send(testUser.withPassword);
    assert.equal("create user success", res.body.msg);
    assert.equal(1, await User.countDocuments(testUser.withNeither).exec());
  });

  it("POST /login success", async () => {
    const testUser = await genUserData();
    await new User(testUser.withHash).save();
    const res = await request(App).post("/login").send(testUser.withPassword);
    assert.equal("login success", res.body.msg);
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
