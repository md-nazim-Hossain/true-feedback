import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import { IMessage } from "@/types/interfaces";
import VerificationEmail from "@emails/vertification-email";

type Props = {
  email: string;
  username: string;
  verifyCode: string;
};

export async function sendVerificationEmail({
  email,
  username,
  verifyCode,
}: Props): Promise<ApiResponse<IMessage[]>> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
      text: `Your verification code is ${verifyCode}`,
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    return {
      success: false,
      message: "Error sending verification email",
      data: [],
    };
  }
}
