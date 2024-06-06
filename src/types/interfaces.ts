import { Document } from "mongoose";

export interface IMessage {
  _id: string;
  content: string;
  createdAt: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessages: boolean;
  messages: IMessage[];
}
