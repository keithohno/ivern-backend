import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  phone: string;
}

const schema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
});

const User = model<IUser>("IUser", schema);

export default User;
