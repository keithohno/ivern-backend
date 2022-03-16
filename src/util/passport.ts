import passport from "passport";
import { Strategy } from "passport-local";
import User, { IUser } from "../models/user";
import argon2 from "argon2";

passport.use(
  new Strategy(
    { usernameField: "phone" },
    async (phone: string, password: string, done: any) => {
      User.findOne({ phone }, (err: Error, user: IUser) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        if (!argon2.verify(user.hash, password)) return done(null, false);
        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user: IUser, done) => {
  done(null, user.phone);
});

passport.deserializeUser((phone, done) => {
  User.find({ phone }, (err, user) => {
    done(err, user);
  });
});
