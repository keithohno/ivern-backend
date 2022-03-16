import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  phone: string;
  hash: string;
}

const schema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
});

const User = model<IUser>("IUser", schema);

export default User;
