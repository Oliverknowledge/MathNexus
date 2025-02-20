"use server"
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Problem from "@/models/problemModels"; // Import the problem model
import { connectToDB } from "@/lib/mongoose";


connectToDB();
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      
      const id  = (await params).id
      
      console.log(id);
      if (!id) return NextResponse.json({ message: "Problem ID is required" }, { status: 400 });
  
      const problem = await Problem.findById(id);
      if (!problem) return NextResponse.json({ message: "Problem not found" }, { status: 404 });
  
      return NextResponse.json(problem, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Server Error", error }, { status: 500 });
    }
  }