import { Router } from "express";
import argon2 from "argon2";

import User from "../models/user";

const router = Router();

export default router;

router.post("/new", async (req, res) => {
  if ((await User.countDocuments({ phone: req.body.phone })) !== 0) {
    res.send({ msg: "create user failure: duplicate user" });
    return;
  }
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    hash: await argon2.hash(req.body.password),
  });
  await user.save();
  res.send({ msg: "create user success" });
});
