import { Router } from "express";
import argon2 from "argon2";

import User, { IUser } from "../../models/user";
import { authenticated } from "../../util/passport";

const router = Router();

router.get("/get", authenticated, (req, res) => {
  const user = req.user as IUser;
  res.json({ name: user.name, phone: user.phone });
});

router.put("/", authenticated, async (req, res) => {
  const user = await User.findOne({ phone: (req.user as IUser).phone });
  if (req.body.name) user.name = req.body.name;
  if (req.body.password) user.hash = await argon2.hash(req.body.password);
  if (req.body.phone)
    if ((await User.countDocuments({ phone: req.body.phone })) === 0)
      user.phone = req.body.phone;
    else return res.json({ msg: "update user failure (phone taken)" });
  await user.save();
  res.json({ msg: "update user success" });
});

export default router;
