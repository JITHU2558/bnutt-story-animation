import { NextResponse } from "next/server";
import { generateSceneImage } from "@/lib/imageGenerator";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const prompt = body?.prompt;

    if (
      typeof prompt !== "string" ||
      !prompt.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "A valid image prompt is required.",
        },
        {
          status: 400,
        }
      );
    }

    const image =
      await generateSceneImage(prompt);

    const arrayBuffer =
      await image.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          image.type || "image/png",
        "Cache-Control":
          "no-store",
      },
    });
  } catch (error) {
    console.error(
      "Image generation error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Image generation failed.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}