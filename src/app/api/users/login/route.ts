import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid Credentials" },
        { status: 400 }
      );
    }

    // match password
    const matchPassword = await bcryptjs.compare(password, user.password);
    if (!matchPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid Credentials" },
        { status: 400 }
      );
    }

    // create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // create token
    const token = await jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET!, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      token,
      message: "Login Successful",
      success: true,
    });
    response.cookies.set("jwtToken", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
