"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-3 xl:px-5 max-w-screen-lg py-8 min-h-dvh flex justify-center items-center flex-col">
      <div>
        <h1 className="text-[80px] text-center font-bold text-amber-400">
          404
        </h1>
        <h2 className="mt-6">
          Are you ready to test your travel knowledge and embark on the ultimate
          guessing adventure? In{" "}
          <span className="text-xl font-bold text-amber-400">
            Globetrotter 🌍
          </span>
          , you'll receive cryptic clues about famous destinations across the
          world. Your challenge? Figure out where they lead!
        </h2>
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
