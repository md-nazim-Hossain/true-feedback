import { sendApiResponse } from "@/lib/apiResponse";
import { catchAsyncRouteWithSession } from "@/lib/catchAsync";
import { UserModel } from "@/models/User";
import { Session } from "next-auth";
import { NextRequest } from "next/server";

export const DELETE = catchAsyncRouteWithSession(
  async (req: NextRequest, session: Session, params: { meesageId: string }) => {
    const { meesageId } = params;
    const updatedResult = await UserModel.updateOne(
      { _id: session?.user?._id },
      { $pull: { messages: { _id: meesageId } } }
    );

    if (updatedResult.modifiedCount === 1) {
      return sendApiResponse({
        message: "Message deleted successfully",
        statusCode: 200,
      });
    }
    return sendApiResponse({
      success: false,
      message: "Message not found or already deleted",
      statusCode: 500,
    });
  }
);
