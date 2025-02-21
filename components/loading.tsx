import React from 'react'
import { easeIn, motion } from 'framer-motion'
const Loading = () => {
  return (
    <div className = "min-h-screen min-w-screen bg-gradient-to-br flex justify-center items-center from-gray-900 via-black to-gray-900">
        <div className = "">
            <motion.div
              animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 180, 0, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "0%"],
            }}
            transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
            }}
               style = {box}
            className = "animate-pulse"
            />
        </div>
    </div>
  )
}
const box = {
    width: 100,
    height: 100,
    backgroundColor: "lightblue",
    borderRadius: 5,
}   

export default Loading