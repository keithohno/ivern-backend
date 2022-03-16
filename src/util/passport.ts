import passport from "passport";
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
  User.findOne({ phone: phone }, (err: NativeError, user: IUser) => {
    done(err, user);
  });
});
