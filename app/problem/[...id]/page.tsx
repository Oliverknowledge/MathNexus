"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "katex/dist/katex.min.css";

import Latex from "react-latex-next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";

 
interface Problem {
  _id: string;
  title: string;
  description: string;
  hints: string[];
  solution: string;
  answer: string; // Expected correct answer
}

const inputSchema = z.object({
  answer: z.string().nonempty("Answer is required"),

})
export default function Page() {
  const { id } = useParams(); // Destructures the id from the URL 
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [ solved, setSolved ] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(0);
  const [credits, setCredits] = useState<number>(0);
  const [hintsShown, setHintsShown] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const hintCost = 5;
  const [feedback, setFeedback] = useState<string | null>(null);
  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      answer: "",
    },
  })
 
  async function onSubmit(data: z.infer<typeof inputSchema>) {
    if (!problem) {
      setFeedback("Error: Problem not found.");
      return;
    }
  
    if (!session) {
      setFeedback("❌ You must be logged in to submit an answer.");
      return;
    }
  
    const res = await fetch(`/api/problems/solved/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
  
    const responseData = await res.json();
    console.log("Response Data:", responseData);
  
    // Handle case where problem is already solved
    if (responseData.message === "Problem already marked as solved") {
      setFeedback("❌ Problem already marked as solved");
      return;
    }
  
    // Check if the answer is correct
    if (data.answer === problem.answer) {
      setFeedback("✅ Correct! Well done.");
    } else {
      setFeedback("❌ Incorrect. Try again!");
      return;
    }
  
    // Fetch updated XP & Credits *after* submitting
    fetch(`/api/user/progress`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Updated XP:", data.xp);
        console.log("Updated Credits:", data.credits);
        setXp(data.xp); // Ensure XP is updated correctly
        setCredits(data.credits);
        setSolved(true);
      })
      .catch((err) => console.error("Error fetching updated user progress:", err));
  }
  useEffect(() => {
    if (session) {
      fetch(`/api/user/progress`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched XP:", data.xp);
          console.log("Fetched Credits:", data.credits);
          setXp(data.xp);
          setCredits(data.credits);
        })
        .catch((err) => console.error("Error fetching user progress:", err));
  
      fetch(`/api/problems/solved`)
        .then((res) => res.json())
        .then((data) => {
          if (data.solvedProblems.includes(id)) {
            setSolved(true);
          }
        })
        .catch((err) => console.error("Error checking solved problems:", err));
    }
  }, [session]); // ✅ Only fetch once on page load
  
  useEffect(() => {
    fetch(`/api/problems/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProblem(data);
        setLoading(false);
  })
      .catch((err) => console.error("Error fetching problem:", err));
    
  }, [id]);


  if (loading)
    return (
      <Loading/>
    );

  if (!problem)
    return (
      <p className="text-red-500 text-center mt-10">
        Error: Problem not found.
      </p>
    );

 
  return (
    <motion.div className = "w-screen mx-auto bg-gray-900 text-white overflow-hidden">
      {session && (
        <div className="mt-4 absolute z-10 top-0 right-10  border-gray-200 border text-white p-3 rounded">
          <p>XP: {xp} ⭐</p>
          <p>Credits: {credits} 💰</p>
        </div>
      )}
      <Button
        onClick={() => router.push("/problems")}
        className="absolute top-6 left-6 z-10 px-4 bg-gray-600 hover:bg-gray-700 py-2 rounded transition"
        >
        ⬅ Back
      </Button>
    <div className="max-w-7xl  mx-auto p-8 min-h-screen bg-gray-900 text-white relative">
      {/* Back Button */}

      {/* Problem Title */}
      <motion.h1
        className="md:text-4xl lg:text-5xl text-3xl font-bold text-center mb-4 mt-16"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {problem.title}
      </motion.h1>

      {/* Problem Statement */}
      <motion.div
        className="bg-gray-800 p-4 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Latex>{problem.description || "No description available."}</Latex>

      </motion.div>
     
      {/* Answer Input */}
      <div className="mt-6">
        
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className = "font-semibold text-2xl">Answer</FormLabel>
              <FormControl>
                <Input placeholder="1234..." {...field} />
              </FormControl>
              <FormDescription>
                Enter your answer
              </FormDescription>
            <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary" >Submit</Button>
      </form>
    </Form>
        
        {feedback && (
          <p className={`mt-2 ${feedback.includes("✅") ? "text-green-400" : "text-red-400"}`}>
            {feedback}
          </p>
        )}
      </div>

      {/* Hints Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Hints</h2>
        <div key={`hints-${hintsShown}`}>
          {problem.hints?.slice(0, hintsShown).map((hint, index) => (
            <motion.p
              key={index}
              className="p-2 border border-gray-200 rounded mt-2 text-gray-200"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Latex>{hint}</Latex>
            </motion.p>
          ))}
        </div>
        {hintsShown < (problem.hints?.length || 0) && (
          <motion.button
            onClick={() => setHintsShown(hintsShown + 1)}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            whileHover={{ scale: 1.05 }}
          >
            Show Hint
          </motion.button>
        )}
      </div>

      {/* Solution Section */}
      <div className="mt-8">
        <motion.button
          onClick={() => setShowSolution(!showSolution)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
          whileHover={{ scale: 1.05 }}
        >
          {showSolution ? "Hide" : "Show"} Solution
        </motion.button>
        {showSolution && (
          <motion.div
            className="bg-green-800 p-4 rounded mt-3 text-gray-200"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Latex>{problem.solution || "No solution available."}</Latex>
          </motion.div>
        )}
      </div>
    </div>
    </motion.div>
  );
}
