"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

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




  const filteredProblems =
    selectedDifficulty === "All"
      ? problems
      : problems.filter((p: any) => p.difficulty === selectedDifficulty);
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
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
                className="block p-6 bg-gray-800 rounded-lg shadow-md transition transform hover:scale-105 duration-500 hover:shadow-blue-500/50"
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
