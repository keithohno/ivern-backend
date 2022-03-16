import "dotenv/config";
import express from "express";
import session from "express-session";
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
    res.send({ msg: "login success" });
  }
);

app.post("/create_user", async (req, res) => {
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    hash: await argon2.hash(req.body.password),
  });
  await user.save();
  res.send({ msg: "create user success" });
});

app.get("/fail", (req, res) => {
  res.send({ msg: "login failure" });
});

export default app;
