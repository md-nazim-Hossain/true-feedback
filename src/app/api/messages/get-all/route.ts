import { sendApiResponse } from "@/lib/apiResponse";
import { catchAsyncRouteWithSession } from "@/lib/catchAsync";
import { UserModel } from "@/models/User";
import { IMessage } from "@/types/interfaces";
import mongoose from "mongoose";
import { Session } from "next-auth";
import { NextRequest } from "next/server";

export const GET = catchAsyncRouteWithSession(
  async (req: NextRequest, session: Session) => {
    const _id = new mongoose.Types.ObjectId(session?.user?._id);
    const user = await UserModel.aggregate([
      { $match: { _id } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return sendApiResponse({
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }
    return sendApiResponse<IMessage[]>({
      message: "User messages fetched successfully",
      statusCode: 200,
      data: user[0].messages,
    });
  }
);
