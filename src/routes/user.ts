import { Router } from "express";
import argon2 from "argon2";

import User from "../models/user";
import { authenticated } from "../util/passport";

const router = Router();

export default router;

router.post("/new", async (req, res) => {
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

router.put("/:phone", authenticated, async (req, res) => {
  const user = await User.findOne({ phone: req.params.phone });
  if (req.body.name) user.name = req.body.name;
  if (req.body.password) user.hash = await argon2.hash(req.body.password);
  if (req.body.phone)
    if ((await User.countDocuments({ phone: req.body.phone })) === 0)
      user.phone = req.body.phone;
    else return res.json({ msg: "update user failure (phone taken)" });
  await user.save();
  res.json({ msg: "update user success" });
});
