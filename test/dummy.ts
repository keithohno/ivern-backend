import crypto from "crypto";
import argon2 from "argon2";

import User from "../src/models/user";

export const dummy = async (options = { save: true }) => {
  const name = crypto.randomBytes(20).toString("hex");
  const phone = crypto.randomBytes(20).toString("hex");
  const password = crypto.randomBytes(20).toString("hex");
  const hash = await argon2.hash(password);
  const client = { name, phone, password };
  const db = { name, phone, hash };
  const filter = { name, phone };
  const save = async () => {
    await new User(db).save();
  };
  if (options.save) save();
  return { client, db, filter, save };
};
