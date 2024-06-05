import { IUser } from "@/types/interfaces";
import { Model, Schema, model, models } from "mongoose";
import { messageSchema } from "./Message";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      required: [true, "Verify code is required"],
    },
    verifyCodeExpiry: {
      type: Date,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export const UserModel =
  (models.User as Model<IUser>) || model<IUser>("User", userSchema);
