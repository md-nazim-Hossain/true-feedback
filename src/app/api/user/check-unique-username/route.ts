import { sendApiResponse } from "@/lib/apiResponse";
import { catchAsyncRoute } from "@/lib/catchAsync";
import { UserModel } from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";
import { z } from "zod";

const usernameQueryValidation = z.object({
  username: usernameValidation,
});

export const GET = catchAsyncRoute(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return sendApiResponse({
      message: "Username is required",
      statusCode: 400,
      success: false,
    });
  }

  //zod validation check
  const result = usernameQueryValidation.safeParse({ username });
  if (!result.success) {
    const error = result.error.format().username?._errors || [];
    return sendApiResponse({
      success: false,
      message: error.length > 0 ? error.join(",") : "Invalid username",
      statusCode: 400,
    });
  }

  //database query check
  const user = await UserModel.findOne({
    username: result.data.username,
    isVerified: true,
  });

  if (!user) {
    return sendApiResponse({
      message: "username is available",
      statusCode: 200,
      success: true,
    });
  } else {
    return sendApiResponse({
      message: "username is already taken",
      statusCode: 400,
      success: false,
    });
  }
});
