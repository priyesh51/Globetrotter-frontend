import { Suspense } from "react";
import HomePage from "./home";
import { get } from "@/lib/axiosInstance";

async function getDataByQueryParam(username: string) {
  try {
    const users = await get(`/users/${username}`);
    return users.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: any;
}) {
  const { username } = await searchParams;

  const invitee = await getDataByQueryParam(username || "");

  return invitee
    ? {
        title: `PLAY | Globetrotter 🌍`,
        description:
          "test your travel knowledge and embark on the ultimate guessing adventure. In Globetrotter, you'll receive cryptic clues about famous destinations across the world.",
        canonical: `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/invite?username=${encodeURIComponent(username)}`,
        openGraph: {
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og-image?username=${invitee?.username}&score=${invitee?.score}`,
              width: 1200,
              height: 630,
              alt: invitee?.username,
            },
          ],
          url: `${
            process.env.NEXT_PUBLIC_BASE_URL
          }/invite?username=${encodeURIComponent(username)}`,
          siteName: "Globetrotter 🌍",
          locale: "en_US",
          type: "website",
        },
        twitter: {
          title: `PLAY | Globetrotter 🌍`,
          card: "summary_large_image",
        },
      }
    : {
        title: `PLAY | Globetrotter 🌍`,
        description:
          "test your travel knowledge and embark on the ultimate guessing adventure. In Globetrotter, you'll receive cryptic clues about famous destinations across the world.",
      };
}

export default async function IndexPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const { username } = await searchParams;

  const invitee = await getDataByQueryParam(username || "");

  return (
    <Suspense>
      <HomePage invitee={invitee} />
    </Suspense>
  );
}
