"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Counter from "./counter";

export default function ScoreProgress({ score }: { score: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setProgress(score); // Animate to the given score
    }, 500);
  }, [score]);

  const radius = 30; // Circle size
  const circumference = 2 * Math.PI * radius; // Total circumference
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        {/* Background Circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="#2f2f2f"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="#ffba00"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          animate={{ strokeDashoffset: progressOffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>

      {/* Score Display */}
      <div className="absolute text-2xl font-bold text-amber-400">
        <Counter number={score / 10} />
      </div>
    </div>
  );
}
