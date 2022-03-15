import User, { IUser } from "../models/user";

export const insert = async (userObj: IUser) => {
  const newUser = new User(userObj);
  return await newUser.save();
};

export const clear = async () => {
  await User.deleteMany({});
};

export const update = async (filter: object, fields: object) => {
  return await User.updateOne(filter, fields);
};

export const find = async (filter: object) => {
  return await User.findOne(filter);
};

export const count = async (filter?: object) => {
  return await User.countDocuments(filter);
};
