"use client";

import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight-new";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session){
      router.push("/problems");
    }
  })
 
  const title = [
    { text: "Prepare" },
    { text: "for" },
    { text: "math" },
    { text: "competitions", className: "text-blue-500" },
  ];
  async function handleSubmit(){
    await signIn("google", {callbackUrl: "/problems"});
  }
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 text-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      <Spotlight />
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
        className = "absolute top-[10%] right-[10%] text-yellow-500 text-4xl opacity-20"
        animate = {{rotate: [0, 20, -10, 0]}}
        transition = {{repeat: Infinity, duration: 4}}
      >
        ∈
        
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
        <div className = "flex flex-col items-center space-y-6">
          <Button onClick = {() => handleSubmit()} className = "mt-8 px-6 py-3 text-lg modernButtonLight hover:bg-gray-200">Sign up with google</Button>
          <Button
            onClick={() => router.push("/problems")}
            variant = {"modernLight"}

          >
            Continue as guest
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
