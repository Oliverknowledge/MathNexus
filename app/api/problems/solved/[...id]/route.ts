"use server";
import { NextResponse } from "next/server";
import User from "@/models/user.models";
import { connectToDB } from "@/lib/mongoose";
import { auth } from "@/auth";


export async function POST(req: Request) {
  try {
    console.log("This is the request", req);
    await connectToDB();
    let { id }  =  await req.json();
    
    const idString = id.toString();

    const session = await auth();
    console.log("This is the session", session);
    if (!session || !session.user) {
      console.log("Unauthorized");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.solvedProblems.includes(idString)) { // Checks if the array already contains the problemID (user has already solved the problem)

      user.solvedProblems.push(idString); // Adds the problemID to the array
      await user.save();
      console.log("Problem marked as solved");
    }
    else if (user.solvedProblems.includes(idString)){
      console.log("Problem already marked as solved");
        return NextResponse.json({ message: "Problem already marked as solved" }, { status: 200 });
    }

    return NextResponse.json({ message: "Problem marked as solved" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
