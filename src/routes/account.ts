import { Router } from "express";
import passport from "passport";

const router = Router();

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/fail" }),
  (req, res) => {
    res.send({ msg: "login success" });
  }
);

router.get("/fail", (req, res) => {
  res.send({ msg: "login failure" });
});

export default router;
