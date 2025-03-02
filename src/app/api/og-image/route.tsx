import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") || "Someone";
  const score = searchParams.get("score") || 0;

  // Load font from Google Fonts (Roboto)
  const fontData = await fetch(
    "https://github.com/googlefonts/spacemono/raw/refs/heads/main/fonts/ttf/SpaceMono-Regular.ttf"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#101828",
          color: "#FFFFFF",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div style={{ marginTop: 40 }}>🌍 Globetrotter 🌍</div>
        <div style={{ marginTop: 40, display: "flex", gap: 5, fontSize: 42 }}>
          "
          <span style={{ color: "#ffba00", fontWeight: "bold" }}>
            {username}
          </span>
          " has challenged you!
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 5 }}>
          They scored{" "}
          <span style={{ color: "#ffba00", fontWeight: "bold", marginLeft: 10 }}>{score}</span>
          <span>/10</span>. Can you beat their score?
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Spacemono",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
