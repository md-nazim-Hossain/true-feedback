import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

const generateHashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const generateVerifyExpiry = () => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 1);
  return expiryDate;
};

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const { email, password, username } = await req.json();
    const findExistingUserByUserName = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (findExistingUserByUserName) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        );
      } else {
        existingUserByEmail.password = await generateHashPassword(password);
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = generateVerifyExpiry();
        await existingUserByEmail.save();
      }
    } else {
      const newUser = await UserModel.create({
        username,
        email,
        password: await generateHashPassword(password),
        verifyCode,
        verifyCodeExpiry: generateVerifyExpiry(),
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    //Send verification email
    const emailResponse = await sendVerificationEmail({
      email,
      verifyCode,
      username,
    });
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "User Registered Successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      { success: false, message: "Error signing up user" },
      { status: 500 }
    );
  }
};
