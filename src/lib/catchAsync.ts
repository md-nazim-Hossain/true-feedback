import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { sendApiResponse } from "./apiResponse";

export function catchAsyncRoute(fn: Function) {
  return async (req: NextRequest, res: NextResponse) => {
    await dbConnect();
    try {
      return await fn(req, res);
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        {
          success: false,
          message: error?.message || "Something went wrong",
        },
        {
          status: 500,
        }
      );
    }
  };
}

export function catchAsyncRouteWithSession(fn: Function) {
  return async (req: NextRequest, { params }: any) => {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return sendApiResponse({
        success: false,
        message: "Unauthorized",
        statusCode: 401,
      });
    }
    try {
      return await fn(req, session, params);
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        {
          success: false,
          message: error?.message || "Something went wrong",
        },
        {
          status: 500,
        }
      );
    }
  };
}
