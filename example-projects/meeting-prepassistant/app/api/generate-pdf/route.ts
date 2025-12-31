import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import MeetingBriefDocument from "@/app/components/MeetingBriefDocument";
import { MeetingPrepResult } from "@/app/types/meeting-prep";

// Configure the route for Vercel
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { result, filename } = body as {
      result: MeetingPrepResult;
      filename: string;
    };

    if (!result) {
      return NextResponse.json(
        { error: "Meeting brief data is required" },
        { status: 400 }
      );
    }

    // Generate PDF using react-pdf
    const document = React.createElement(MeetingBriefDocument, { result });
    const stream = await renderToStream(document);

    // Convert stream to buffer
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);

    // Return PDF as downloadable file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);

    // Return detailed error in development, generic in production
    const errorMessage = process.env.NODE_ENV === "production"
      ? "Failed to generate PDF"
      : error instanceof Error
        ? error.message
        : "Unknown error occurred";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
