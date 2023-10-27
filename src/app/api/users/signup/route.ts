import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, username, password } = reqBody;
    console.log(reqBody);

    //Check if the user exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        {
          error: "User with the provided email already exists",
          success: false,
        },
        { status: 400 }
      );
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // saving user
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    }).save();

    return NextResponse.json({
      message: "User Created Successfully",
      success: true,
      newUser: newUser,
    });
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
