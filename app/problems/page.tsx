"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  async function handleSignOut() {
    await signOut();
    router.push("/");
  }
  const {data: session } = useSession();
  useEffect(() => {
    fetch("/api/problems")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setProblems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLoading(false);
      });
  }, []);

  async function handleSignIn(){
    await signIn("google");

  }


  const filteredProblems =
    selectedDifficulty === "All"
      ? problems
      : problems.filter((p: any) => p.difficulty === selectedDifficulty);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      {
          session ? (
        <Button onClick={handleSignOut} className=" absolute top-5 left-5  modernButton" variant = "secondary">
        Sign Out
      </Button>) : (
        <Button onClick = {handleSignIn} className=" absolute top-5 left-5  modernButton" variant = "secondary">
        Sign In
      </Button>
      )
}
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-6">Olympiad Problems</h1>

        {/* Difficulty Filter */}
        <div className="flex justify-center space-x-4 mb-6">
          {["All", "Easy", "Medium", "Hard"].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedDifficulty === level
                  ? "bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-700 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        ) : filteredProblems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProblems.map((p: any) => (
              <Link
                key={p._id}
                href={`/problem/${p._id}`}
                className="block p-6 bg-gray-800 rounded-lg modernButton"
              >
                <h2 className="text-xl font-semibold">{p.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{p.difficulty}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-6">
            No problems found for this difficulty.
          </p>
        )}
      </div>
    </div>
  );
}
