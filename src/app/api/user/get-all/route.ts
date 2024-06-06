import { sendApiResponse } from "@/lib/apiResponse";
import { catchAsyncRoute } from "@/lib/catchAsync";
import { UserModel } from "@/models/User";
import { IUser } from "@/types/interfaces";

export const GET = catchAsyncRoute(async () => {
  const users = await UserModel.find({ isVerified: true }).select(
    "-password -verifyCode -verifyCodeExpiry"
  );
  return sendApiResponse<IUser[]>({
    message: "Users fetched successfully",
    data: users,
    statusCode: 200,
  });
});
