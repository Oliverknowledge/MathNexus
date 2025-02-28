"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";

const problemSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  hints: z.string(),
  solution: z.string().min(10, "Solution is required"),
  answer: z.string().min(1, "Answer is required"),
  difficulty: z.string(),
  year: z.number()
    .int()
    .min(0)
    .max(new Date().getFullYear(), "Invalid year"),
});

export default function AddProblemPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const {register,handleSubmit,formState: { errors }} = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      hints: "",
      solution: "",
      answer: "",
      difficulty: "Easy",
      year: new Date().getFullYear(),
    },
  });

  if (!session) {
    return (
      <div className="flex justify-center  items-center h-screen text-white bg-gray-900">
        <p className="text-red-400 text-lg">🚫 Not an authorized route</p>
      </div>
    );
  }

  async function onSubmit(data: z.infer<typeof problemSchema>){
    setUploading(true);
    const problemData = {
      ...data,
      hints: data.hints.split("\n"), //I don't know how many hints there are...
    };

    const res = await fetch("/api/problems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(problemData),
    });

  
    setUploading(false);
  };

  return (
    <div className="flex justify-center overflow-hidden items-center min-h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 text-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-green-400 mb-4">Add a New Problem</h1>
        <p className="text-gray-400 mb-6">Fill in the details below.</p>
        <Button onClick = {() => router.push("/problems")} variant={"modernLight"}  className = "absolute top-10 left-10 text-black">👁️ View</Button>  
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-gray-300 block mb-1">Title</label>
            <Input {...register("title")} className="bg-gray-700 border-gray-600 text-white" />
            {errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Description (supports LaTeX)</label>
            <Textarea {...register("description")} className="bg-gray-700 border-gray-600 text-white" />
            {errors.description && <p className="text-red-400 text-sm">{errors.description.message}</p>}
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Hints (one per line)</label>
            <Textarea {...register("hints")} className="bg-gray-700 border-gray-600 text-white" />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Solution (supports LaTeX)</label>
            <Textarea {...register("solution")} className="bg-gray-700 border-gray-600 text-white" />
            {errors.solution && <p className="text-red-400 text-sm">{errors.solution.message}</p>}
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Final Answer</label>
            <Input {...register("answer")} className="bg-gray-700 border-gray-600 text-white" />
            {errors.answer && <p className="text-red-400 text-sm">{errors.answer.message}</p>}
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Year</label>
            <Input {...register("year", { valueAsNumber: true })} type="number" className="bg-gray-700 border-gray-600 text-white" />
            {errors.year && <p className="text-red-400 text-sm">{errors.year.message}</p>}
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Difficulty</label>
            <select {...register("difficulty")} className="p-2 bg-gray-700 border-gray-600 text-white rounded-md w-full">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <Button type="submit" size="lg" className="w-full bg-green-500 hover:bg-green-600" disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
