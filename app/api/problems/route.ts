import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Problem from "@/models/problemModels"; // Import the problem model
import { connectToDB } from "@/lib/mongoose";

connectToDB();


export async function GET() {
  try {
    
    const problems = await Problem.find();
    return NextResponse.json(problems, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error", error }, { status: 500 });
  }
}   


export async function POST(req: Request) {
  try {

    const data = await req.json(); 
    const newProblem = new Problem(data);
    await newProblem.save();
    return NextResponse.json({ message: "Problem added successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to add problem", error }, { status: 500 });
  }
}
 