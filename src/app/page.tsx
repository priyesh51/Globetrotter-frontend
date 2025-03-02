"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-3 xl:px-5 max-w-screen-lg py-8 min-h-dvh flex justify-center items-center flex-col">
      <div>
        <h1 className="text-2xl text-center font-bold text-amber-400">
          🌍 Welcome to The Globetrotter! 🌍
        </h1>
        <h2 className="mt-6">
          Are you ready to test your travel knowledge and embark on the ultimate
          guessing adventure? In Globetrotter, you'll receive cryptic clues
          about famous destinations across the world. Your challenge? Figure out
          where they lead!
        </h2>
        <div className="mt-6">
          <ul>
            <li>
              🔎 Decode the Clues – Use your knowledge of landmarks, cultures,
              and history to uncover each mystery destination.
            </li>
            <li>
              💡 Make Your Guess – Type in your answer and see if you’re
              correct!
            </li>
            <li>
              🎉 Unlock Fun Facts & Surprises – Each correct guess reveals
              fascinating trivia, hidden gems, and exciting insights about the
              destination.
            </li>
            <h3 className="mt-6 text-center">
              Think you have what it takes to be a true Globetrotter? Let’s
              PLAY! 🌍✈️🔑
            </h3>
          </ul>
        </div>
      </div>
      <button
        className="neo-pop-tilted-button mt-12"
        onClick={() => router.push("/play")}
      >
        <span>Play Now</span>
      </button>
    </div>
  );
}
