import crypto from "crypto";
import argon2 from "argon2";

export const genUserData = async () => {
  const name = crypto.randomBytes(20).toString("hex");
  const phone = crypto.randomBytes(20).toString("hex");
  const password = crypto.randomBytes(20).toString("hex");
  return {
    withPassword: {
      name: name,
      phone: phone,
      password: password,
    },
    withHash: {
      name: name,
      phone: phone,
      hash: await argon2.hash(password),
    },
    withNeither: {
      name: name,
      phone: phone,
    },
  };
};
