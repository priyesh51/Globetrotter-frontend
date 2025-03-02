"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import ScoreProgress from "@/components/scoreprogress";
import { post } from "@/lib/axiosInstance";
import Image from "next/image";

const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

type CityData = {
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
};

type Questions = {
  allCities: CityData[];
  correctCity: CityData;
};

export default function HomePage({ questions }: { questions: Questions[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showSadFace, setShowSadFace] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [nextVisible, setNextVisible] = useState<boolean>(false);
  const [playAgainVisible, setPlayAgainVisible] = useState<boolean>(false);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [inviteLink, setInviteLink] = useState<string>("");
  const [errorInput, setErrorInput] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setInviteLink("");
    setImageUrl("");
    if (isValidUsername(e.target.value)) {
      setErrorInput(false);
    } else {
      setErrorInput(true);
    }
  };

  const isValidUsername = (username: string) => usernameRegex.test(username);

  const { allCities, correctCity } = questions[questionIndex];

  const closeDialog = () => {
    setIsOpen(false);
    if (questionIndex === questions.length - 1) {
      setPlayAgainVisible(true);
      setNextVisible(false);
    } else {
      setNextVisible(true);
    }
  };

  const closeShareDialog = () => {
    setIsShareDialogOpen(false);
    setInviteLink("");
    setImageUrl("");
    setErrorInput(false);
  };

  const openDialog = () => setIsOpen(true);
  const openShareDialog = () => setIsShareDialogOpen(true);

  const handleSelect = (city: string) => {
    setAnswered(true);
    setSelected(city);
    setIsDirty(true);
    if (city === correctCity.city) {
      setScore(score + 1);
      setShowConfetti(true); // Trigger confetti on correct answer
    } else {
      setShowSadFace(true); // Show sad face on wrong answer
    }
  };

  const handleNext = () => {
    setAnswered(false);
    setShowConfetti(false);
    setShowSadFace(false);
    setNextVisible(false);
    setQuestionIndex((idx) => idx + 1);
  };

  const playAgain = () => {
    router.refresh();
    setAnswered(false);
    setShowConfetti(false);
    setShowSadFace(false);
    setNextVisible(false);
    setPlayAgainVisible(false);
    setQuestionIndex(0);
  };

  const handleGenerateInviteLink = async () => {
    if (username.trim() !== "" && isValidUsername(username)) {
      const link = `${
        window.location.origin
      }/invite?username=${encodeURIComponent(username)}`;

      const imageUrl = `${window.location.origin}/api/og-image?username=${username}&score=${score}`;

      setImageUrl(imageUrl);

      setLoading(true);
      try {
        await post("/users", { username, score, link });
      } catch (error) {
        console.error("Failed to create user:", error);
        setErrorInput(true);
      } finally {
        setLoading(false);
        setInviteLink(link);
      }
    } else {
      setErrorInput(true);
    }
  };

  const handleShareViaWhatsApp = () => {
    if (inviteLink) {
      const shareText = `I scored *${score}*/10 in *Globetrotter*! Think you can beat me?\n\nPlay now: ${inviteLink}`;
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareText)}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ""; // Required for modern browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <div className="relative">
      {showConfetti && (
        <Confetti
          gravity={0.2}
          recycle={false}
          numberOfPieces={250}
          width={window.innerWidth}
          height={window.innerHeight}
          onConfettiComplete={() => {
            setShowConfetti(false);
            openDialog();
          }}
        />
      )}

      {/* Sad face animation */}
      {showSadFace && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          animate={{ scale: [0, 1.5, 1, 0] }} // Growing effect
          transition={{
            type: "tween", // Using tween for multiple keyframes
            duration: 1.5, // Duration for the growing effect
            ease: "easeInOut", // Smooth easing
          }}
          initial={{ scale: 0 }}
          onAnimationComplete={() => {
            setShowSadFace(false);
            openDialog();
          }}
        >
          <div className="text-[200px] text-red-500">😓</div>{" "}
          {/* Sad face emoji */}
        </motion.div>
      )}

      <AnimatePresence>
        {/* Dialog Overlay */}
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-gray-600 flex justify-center items-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }} // Only change opacity of overlay
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
            <motion.div
              className="fixed inset-0 flex justify-center items-center z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="bg-gray-800 p-6 m-4 rounded-md shadow-lg max-w-md">
                {/* Dialog Content */}
                <h2 className="text-xl font-semibold mt-4 mb-1">Fun Fact</h2>
                <p className="text-md">
                  {correctCity.fun_fact?.map((ff, index) => (
                    <span key={index}>{` ${ff}`}</span>
                  ))}
                </p>
                <h2 className="text-xl font-semibold mt-4 mb-1">Trivia</h2>
                <p className="text-md">
                  {correctCity.trivia?.map((tri, index) => (
                    <span key={index}>{` ${tri}`}</span>
                  ))}
                </p>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={closeDialog}
                    className="px-4 cursor-pointer py-2 bg-red-600 text-white rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
        {isShareDialogOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-gray-600 flex justify-center items-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }} // Only change opacity of overlay
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
            <motion.div
              className="fixed inset-0 flex justify-center items-center z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="bg-gray-800 text-center p-6 m-4 rounded-md shadow-lg max-w-md max-h-[calc(100vh-40px)] overflow-y-scroll">
                {/* Dialog Content */}
                <h2 className="text-xl font-semibold mb-1">
                  🔗 Invite Your Friend 🔗
                </h2>
                <div>
                  <span>SCORE: </span>
                  <span className="font-bold text-2xl text-amber-400">
                    {score}
                  </span>
                  <span>/10</span>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter your username"
                  className={`p-2 mb-4 border-2 focus:outline-none focus:ring-0 rounded-md mt-4 w-full ${
                    errorInput ? "border-red-600" : ""
                  }`}
                  autoFocus
                />
                <button
                  onClick={!isLoading ? handleGenerateInviteLink : undefined}
                  className={`px-6 text-center ${
                    isLoading ? "cursor-not-allowed" : "cursor-pointer"
                  } py-3 bg-amber-400 text-black rounded-lg font-bold`}
                >
                  {isLoading ? "Loading..." : "Generate Invite Link"}
                </button>
                {inviteLink && (
                  <div className="mt-8 text-center">
                    <p className="mb-2">Share this link with your friend:</p>
                    <Image
                      src={imageUrl}
                      alt={username}
                      className="rounded-md object-cover mb-3"
                      width={1200}
                      height={630}
                    />
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="w-full p-2 border-2 rounded-md mb-4"
                    />
                    <button
                      onClick={!isLoading ? handleShareViaWhatsApp : undefined}
                      className={`px-6 ${
                        isLoading ? "cursor-not-allowed" : "cursor-pointer"
                      } py-3 bg-green-600 text-white rounded-lg font-bold`}
                    >
                      💬 Share via WhatsApp
                    </button>
                  </div>
                )}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={!isLoading ? closeShareDialog : undefined}
                    className={`px-4 ${
                      isLoading ? "cursor-not-allowed" : "cursor-pointer"
                    } py-2 bg-red-600 text-white rounded-md`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-3 xl:px-5 max-w-screen-lg py-8">
        <div className="flex justify-center items-center flex-col h-full">
          <div className="flex justify-between w-full items-center">
            <h1
              className="text-2xl font-bold text-amber-400 cursor-pointer"
              onClick={() => router.push("/")}
            >
              🌍 GlobeTrotter
            </h1>
            <button
              className="hidden sm:block px-4 py-2 cursor-pointer font-semibold bg-amber-400 text-black rounded-lg"
              onClick={() => openShareDialog()}
            >
              🔗 Challenge A Friend
            </button>
          </div>
          <div className="mt-12 w-full">
            <div>
              <div>
                <span>SCORE: </span>
                <span className="font-bold text-2xl text-amber-400">
                  {score}
                </span>
                <span>/10</span>
              </div>
              <div className="mt-6">
                <p className="font-semibold text-xl">
                  Q {questionIndex + 1}.{" "}
                  {correctCity.clues?.map((clue, index) => (
                    <span key={index}>{` ${clue}`}</span>
                  ))}
                </p>
              </div>
              <div className="mt-6">
                <div className="grid md:grid-cols-2 gap-3">
                  {allCities.map((city, index) => (
                    <motion.button
                      key={index}
                      onClick={() => !answered && handleSelect(city.city)}
                      className={`w-full ${
                        answered ? "cursor-not-allowed" : "cursor-pointer"
                      } px-6 py-3 font-bold border-2 rounded-lg ${
                        answered
                          ? selected === city.city
                            ? city.city === correctCity.city
                              ? "bg-green-600 border-green-500 text-white"
                              : "bg-red-600 border-red-500 text-white"
                            : city.city === correctCity.city
                            ? "bg-green-600 border-green-500 text-white"
                            : ""
                          : "bg-gray-800 border-gray-700 text-amber-400 hover:bg-gray-700 hover:border-amber-400"
                      }`}
                      animate={
                        answered &&
                        selected === city.city &&
                        city.city !== correctCity.city
                          ? { x: [-5, 5, -5, 5, 0] } // Vibrate effect on Option 2
                          : { x: 0 } // No animation for other options
                      }
                      transition={{
                        type: "tween", // Use tween for multiple keyframes
                        duration: 0.2,
                        repeat: 2, // Shakes twice for Option 2
                        ease: "easeInOut",
                      }}
                    >
                      {city.city}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-center items-center">
                {questionIndex !== questions.length - 1 && nextVisible && (
                  <button
                    onClick={handleNext}
                    className="mt-12 px-6 py-3 cursor-pointer font-bold bg-amber-400 text-black rounded-lg"
                  >
                    Next →
                  </button>
                )}
                {playAgainVisible &&
                  questionIndex === questions.length - 1 &&
                  answered && (
                    <div className="flex flex-col mt-2">
                      <ScoreProgress score={score * 10} />
                      <button
                        className="neo-pop-tilted-button"
                        onClick={() => playAgain()}
                      >
                        <span>Play Again</span>
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <button
            className="mt-12 block sm:hidden px-4 py-2 cursor-pointer font-semibold bg-amber-400 text-black rounded-lg"
            onClick={() => openShareDialog()}
          >
            🔗 Challenge A Friend
          </button>
        </div>
      </div>
    </div>
  );
}
