import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image_file") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const apiKey = process.env.REMOVE_BG_API_KEY || "wUNUDANZR8CramNjJj1Eo1w3";
    if (!apiKey) {
      return NextResponse.json({ error: "Remove.bg API key not configured" }, { status: 500 });
    }

    const removeBgFormData = new FormData();
    removeBgFormData.append("image_file", imageFile);
    removeBgFormData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: "Remove.bg API error", details: error }, { status: response.status });
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: { "Content-Type": "image/png", "Content-Disposition": 'attachment; filename="removed-bg.png"' },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 });
  }
}
