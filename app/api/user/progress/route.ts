import { NextResponse } from "next/server";
import User from "@/models/user.models";
import { connectToDB } from "@/lib/mongoose";
import { auth } from "@/auth";


export async function GET() {
  try {
    await connectToDB();
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    console.log("User found", user);
    return NextResponse.json({ xp: user.xp, credits: user.credits }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
