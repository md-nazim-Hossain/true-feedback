import { NextResponse } from "next/server";

type Props<T> = {
  success?: boolean;
  message: string;
  statusCode: number;
  data?: T;
};
export function sendApiResponse<T>({
  success = true,
  message,
  statusCode,
  data,
}: Props<T>): NextResponse {
  return NextResponse.json(
    {
      success,
      message,
      data: data || null,
    },
    { status: statusCode }
  );
}
