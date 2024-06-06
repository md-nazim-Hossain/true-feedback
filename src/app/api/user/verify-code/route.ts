import { sendApiResponse } from "@/lib/apiResponse";
import { catchAsyncRoute } from "@/lib/catchAsync";
import { UserModel } from "@/models/User";
import { NextRequest } from "next/server";

export const POST = catchAsyncRoute(async (req: NextRequest) => {
  const { username, verifyCode } = await req.json();
  const decodedUsername = decodeURIComponent(username);
  if (!decodedUsername || !verifyCode) {
    return sendApiResponse({
      message: "Username and verification code are required",
      statusCode: 400,
      success: false,
    });
  }
  const user = await UserModel.findOne({
    username: decodedUsername,
  });
  if (!user) {
    return sendApiResponse({
      message: "User not found",
      statusCode: 400,
      success: false,
    });
  }
  const isCodeValid = user.verifyCode === verifyCode;
  const isCodeNotExpired = user.verifyCodeExpiry > new Date();
  if (!isCodeValid || !isCodeNotExpired) {
    return sendApiResponse({
      message: "Invalid verification code or expired",
      statusCode: 400,
      success: false,
    });
  }
  user.isVerified = true;
  await user.save();
  return sendApiResponse({
    message: "Account verified successfully",
    statusCode: 200,
    success: true,
  });
});
