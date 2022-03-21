import { Router } from "express";
import passport from "passport";
import argon2 from "argon2";

import User from "../models/user";

const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ msg: "login success" });
});

router.post("/signup", async (req, res) => {
  if ((await User.countDocuments({ phone: req.body.phone })) !== 0) {
    res.json({ msg: "create user failure: duplicate user" });
    return;
  }
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    hash: await argon2.hash(req.body.password),
  });
  await user.save();
  res.json({ msg: "create user success" });
});

export default router;
