import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ msg: "login success" });
});

router.get("/fail", (req, res) => {
  res.json({ msg: "login failure" });
});

export default router;
