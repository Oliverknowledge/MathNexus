"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const router = useRouter();
  const { data: session } = useSession();
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);

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

  useEffect(() => {
    if (session) {
      fetch(`/api/problems/solved`)
        .then((res) => res.json())
        .then((data) => setSolvedProblems(data.solvedProblems))
        .catch((err) => console.error("Error fetching solved problems:", err));
    }
  }, [session]);
  
  async function handleSignIn() {
    await signIn("google");
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  // Search + Filter Logic
  const filteredProblems = problems
    .filter((p: any) =>
      selectedDifficulty === "All" ? true : p.difficulty === selectedDifficulty
    )
    .filter((p: any) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      {/* Background Effects - Lower Opacity & Behind Content */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-10 blur-3xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Sign In/Out Button */}
      {session ? (
        <Button onClick={handleSignOut} className="absolute top-5 left-5 z-10" variant="modernLight">
          Sign Out
        </Button>
      ) : (
        <Button onClick={handleSignIn} className="absolute top-5 left-5 z-10" variant="modernLight">
          Sign In
        </Button>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Title */}
        <motion.h1
          className="text-5xl font-extrabold text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Olympiad Problems
        </motion.h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-lg p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex justify-center space-x-4 mb-6">
          {["All", "Easy", "Medium", "Hard"].map((level) => (
            <motion.button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-4 py-2 rounded-lg text-lg font-semibold transition ${
                selectedDifficulty === level
                  ? "bg-blue-500 shadow-lg"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {level}
            </motion.button>
          ))}
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="h-24 bg-gray-700 animate-pulse rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : filteredProblems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProblems.map((p: any, index) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                 <Button
          onClick={() => router.push(`/problem/${p._id}`)}
          className={`block p-6 h-[100%] rounded-lg transition shadow-lg w-[90%]  ${
            solvedProblems.includes(p._id) ? "bg-green-700 hover:bg-green-800" : "bg-gray-800"
          }`}
        >
          <h2 className="text-xl font-semibold">{p.title}</h2>
          <p className="text-sm text-gray-400 mt-1">{p.difficulty}</p>
        </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-6">No problems found</p>
        )}
      </div>
    </div>
  );
}
