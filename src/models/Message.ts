import { IMessage } from "@/types/interfaces";
import { Model, Schema, model, models } from "mongoose";

export const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MessageModel =
  (models.Message as Model<IMessage>) || model("Message", messageSchema);
