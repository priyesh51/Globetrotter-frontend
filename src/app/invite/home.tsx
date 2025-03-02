"use client";

import { useEffect } from "react";
import { notFound, useRouter } from "next/navigation";

type User = {
  id: number;
  username: string;
  score: number;
  link: string;
  createdAt: number;
};

export default function HomePage({ invitee }: { invitee: User }) {
  const router = useRouter();

  if (!invitee) {
    return notFound();
  }

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // Required for modern browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
          <h3 className="text-3xl text-center">
            "
            <span className="font-bold text-amber-400">{invitee.username}</span>
            " challenged you!
          </h3>
          <p className="text-md text-center mt-3 mb-4">
            They scored{" "}
            <span className="font-bold text-2xl text-amber-400">
              {invitee.score}
            </span>
            <span>/10</span>. Can you beat their score?
          </p>
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
