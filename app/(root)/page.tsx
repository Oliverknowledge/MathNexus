"use client";

import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  const title = [
    { text: "Prepare" },
    { text: "for" },
    { text: "math" },
    { text: "competitions", className: "text-blue-500" },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 text-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      
      {/* Floating Math Symbols */}
      <motion.div
        className="absolute top-10 left-20 text-blue-500 text-5xl opacity-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        ∑
      </motion.div>

      <motion.div
        className="absolute bottom-16 right-16 text-purple-500 text-4xl opacity-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        π
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/4 text-green-500 text-3xl opacity-20"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        ∫
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-3xl"
      >
        <TypewriterEffectSmooth words={title} className="text-5xl  font-bold" />
        <h3 className="mt-4 text-lg text-gray-300 sm:text-xl">
          Solve tough problems with step-by-step hints and solutions.
        </h3>
        <Button
          onClick={() => router.push("/problems")}
          className="mt-8 px-6 py-3 text-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
          variant="friendly"
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}
