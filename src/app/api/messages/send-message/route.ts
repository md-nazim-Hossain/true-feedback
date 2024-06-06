import { sendApiResponse } from "@/lib/apiResponse";
import { catchAsyncRouteWithSession } from "@/lib/catchAsync";
import { UserModel } from "@/models/User";
import { IMessage } from "@/types/interfaces";

export const POST = catchAsyncRouteWithSession(async (req: Request) => {
  const { username, content } = await req.json();
  const findUser = await UserModel.findOne({ username });
  if (!findUser) {
    return sendApiResponse({
      success: false,
      message: "User not found",
      statusCode: 404,
    });
  }

  // is user accepting messages
  if (!findUser.isAcceptingMessages) {
    return sendApiResponse({
      success: false,
      message: "User is not accepting messages",
      statusCode: 403,
    });
  }

  const newMessage: IMessage = {
    content,
    createdAt: new Date().toISOString(),
  };
  findUser.messages.push(newMessage);
  await findUser.save();
  return sendApiResponse<IMessage>({
    message: "Message sent successfully",
    statusCode: 200,
    data: newMessage,
  });
});
