import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { generatePdfHtml } from "@/app/lib/generatePdfHtml";
import { MeetingPrepResult } from "@/app/types/meeting-prep";

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

    // Determine the executable path for Chrome
    const executablePath =
      process.env.NODE_ENV === "production"
        ? await chromium.executablePath()
        : process.platform === "win32"
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : process.platform === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : "/usr/bin/google-chrome";

    // Launch browser
    const browser = await puppeteer.launch({
      args: process.env.NODE_ENV === "production" ? chromium.args : ["--no-sandbox"],
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
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
