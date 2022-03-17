import crypto from "crypto";
import argon2 from "argon2";

export const genUserData = async () => {
  const name = crypto.randomBytes(20).toString("hex");
  const phone = crypto.randomBytes(20).toString("hex");
  const password = crypto.randomBytes(20).toString("hex");
  const hash = await argon2.hash(password);
  const client = { name, phone, password };
  const db = { name, phone, hash };
  const filter = { name, phone };
  return { client, db, filter };
};
