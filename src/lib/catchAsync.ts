import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./dbConnect";

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
