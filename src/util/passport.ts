import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { NativeError } from "mongoose";
import { Strategy } from "passport-local";
import User, { IUser } from "../models/user";
import argon2 from "argon2";

passport.use(
  new Strategy(
    { usernameField: "phone" },
    async (phone: string, password: string, done: any) => {
      const user = await User.findOne({ phone });
      if (!user) return done(null, false);
      if (!(await argon2.verify(user.hash, password))) return done(null, false);
      return done(null, user);
    }
  )
);

passport.serializeUser((user: IUser, done) => {
  done(null, user.phone);
});

passport.deserializeUser((phone, done) => {
  User.findOne({ phone }, (err: NativeError, user: IUser) => {
    done(err, user);
  });
});

export const authenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated())
    if ((req.user as IUser).phone === req.params.phone) return next();
    else res.json({ msg: "authentication failure (wrong user)" });
  else res.json({ msg: "authentication failure (not logged in)" });
};
