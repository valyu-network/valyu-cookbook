import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { generatePdfHtml } from "@/app/lib/generatePdfHtml";
import { MeetingPrepResult } from "@/app/types/meeting-prep";

// Configure the route for Vercel
export const maxDuration = 60;
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

    // Generate HTML from the meeting brief data
    const html = generatePdfHtml(result);

    // Configure chromium for Vercel/serverless environment
    const isProduction = process.env.NODE_ENV === "production";

    let executablePath: string;

    if (isProduction) {
      // Set font config for Vercel deployment
      chromium.setGraphicsMode = false;

      try {
        // Get chromium executable path with error handling
        executablePath = await chromium.executablePath();
      } catch (error) {
        console.error("Failed to get chromium executable path:", error);
        throw new Error("Chromium setup failed. Please ensure @sparticuz/chromium is properly configured for your deployment.");
      }
    } else {
      // Local development
      executablePath = process.platform === "win32"
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : process.platform === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : "/usr/bin/google-chrome";
    }

    // Configure browser args for serverless
    const args = isProduction
      ? [
          ...chromium.args,
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-first-run',
          '--no-sandbox',
          '--no-zygote',
          '--single-process',
        ]
      : ['--no-sandbox', '--disable-setuid-sandbox'];

    // Launch browser
    const browser = await puppeteer.launch({
      args,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    // Set content and wait for it to be ready
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Generate PDF with professional settings
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
      preferCSSPageSize: false,
    });

    await browser.close();

    // Return PDF as downloadable file
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
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
