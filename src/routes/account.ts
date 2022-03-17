import { Router } from "express";
import passport from "passport";
import argon2 from "argon2";

import User from "../models/user";

const router = Router();

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/fail" }),
  (req, res) => {
    res.send({ msg: "login success" });
  }
);

router.post("/create_user", async (req, res) => {
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    hash: await argon2.hash(req.body.password),
  });
  await user.save();
  res.send({ msg: "create user success" });
});

router.get("/fail", (req, res) => {
  res.send({ msg: "login failure" });
});

export default router;
