import { Suspense } from "react";
import HomePage from "./home";
import { get } from "@/lib/axiosInstance";

async function fetchQuestions() {
  try {
    const questions = await get("/questions");
    return questions.data;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
  }
}

export async function generateMetadata() {
  return {
    title: `PLAY | Globetrotter 🌍`,
    description:
      "test your travel knowledge and embark on the ultimate guessing adventure. In Globetrotter, you'll receive cryptic clues about famous destinations across the world.",
  };
}

export default async function IndexPage() {
  const questions = await fetchQuestions();

  return (
    <Suspense>
      <HomePage questions={questions} />
    </Suspense>
  );
}
