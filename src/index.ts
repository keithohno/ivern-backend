import "dotenv/config";
import express from "express";
import session from "express-session";
import { connect } from "mongoose";
import passport from "passport";
import User from "./models/user";
import argon2 from "argon2";
import "./util/passport";

const app = express();

app.use(express.json());
app.use(session({ resave: true, saveUninitialized: true, secret: "jaesul" }));
app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/fail" }),
  (req, res) => {
    res.send("login success");
  }
);

app.post("/create_user", async (req, res) => {
  const user = new User({
    name: "joe",
    phone: req.body.phone,
    hash: await argon2.hash(req.body.password),
  });
  await user.save();
  res.send("create user success");
});

app.get("/fail", (req, res) => {
  res.send("login failed");
});

const main = async () => {
  await connect(process.env.MONGO_URI);

  app.listen(5000, () => {
    console.log(`server started at port 5000`);
  });
};

main().catch((e) => {
  console.log(e);
});

export default app;
