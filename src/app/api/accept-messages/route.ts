import { catchAsyncRouteWithSession } from "@/lib/catchAsync";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { sendApiResponse } from "@/lib/apiResponse";
import { UserModel } from "@/models/User";
import { IUser } from "@/types/interfaces";

export const POST = catchAsyncRouteWithSession(
  async (req: NextRequest, session: Session) => {
    const userId = session?.user?._id as string;
    const { isAcceptingMessages } = await req.json();
    if (!isAcceptingMessages) {
      return sendApiResponse({
        success: false,
        message: "Missing isAcceptingMessages parameter",
        statusCode: 400,
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages,
      },
      { new: true }
    );
    if (!updatedUser) {
      return sendApiResponse({
        success: false,
        message: "Failed to update user",
        statusCode: 500,
      });
    }

    return sendApiResponse<IUser>({
      message: "Message Accepted status updated successfully",
      statusCode: 200,
      data: updatedUser,
    });
  }
);

export const GET = catchAsyncRouteWithSession(
  async (_: NextRequest, sessions: Session) => {
    const userId = sessions?.user?._id as string;
    const user = await UserModel.findById(userId);
    if (!user) {
      return sendApiResponse({
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }
    return sendApiResponse<boolean>({
      message: "User accepting messages status fetched successfully",
      statusCode: 200,
      data: user.isAcceptingMessages,
    });
  }
);
