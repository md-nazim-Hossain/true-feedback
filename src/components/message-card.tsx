"use client";
import { IMessage } from "@/types/interfaces";
import React from "react";
import { Typography } from "./ui/typography";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  message: IMessage;
  handleDeleteMessage: (messageId: string) => void;
};
function MessageCard({ message, handleDeleteMessage }: Props) {
  return (
    <div className="w-full rounded border shadow-md p-5 flex justify-between gap-5">
      <div>
        <Typography variant={"h3"}>{message?.content}</Typography>
        <Typography variant={"p"}>
          {new Date(message?.createdAt).toString()}
        </Typography>
      </div>
      <Button
        onClick={() => handleDeleteMessage(message?._id)}
        variant={"destructive"}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export default MessageCard;
