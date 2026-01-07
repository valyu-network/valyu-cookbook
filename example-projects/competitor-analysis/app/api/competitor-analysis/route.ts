import { NextRequest, NextResponse } from 'next/server';
import { Valyu } from "valyu-js";

// Automatically uses VALYU_API_KEY from environment
const valyu = new Valyu();

// Vercel Pro plan allows up to 800s (13.3 minutes)
export const maxDuration = 800;


export async function POST(req: NextRequest) {
  try {
    const { websiteurl, summaryText } = await req.json();

    if (!websiteurl || !summaryText) {
      return NextResponse.json({ error: 'Website URL and summary text are required' }, { status: 400 });
    }

    // Construct research query for competitor analysis
    const researchQuery = `Analyze the competitor: ${websiteurl}. ${summaryText}.
    Provide a comprehensive analysis including:
    - Company overview and what they do
    - Key products and services
    - Target market and customer base
    - Competitive advantages and unique value propositions
    - Recent developments and news
    - Market positioning and strategy
    - Find other companies or products doing something similar to the competitor`;

    // Create deep research task
    const task = await valyu.deepresearch.create({
      input: researchQuery,
      model: "fast", // Options: "fast" (~5 min), "standard" (10-20 min), "heavy" (up to 90 min)
      urls: [websiteurl], // Include the specific website URL for analysis
      outputFormats: ["markdown", "pdf"] // Request markdown and PDF output
    });

    if (!task.deepresearch_id) {
      throw new Error('Failed to create deep research task');
    }

    // Return task ID immediately for client-side polling
    return NextResponse.json({
      success: true,
      deepresearch_id: task.deepresearch_id,
      status: 'queued',
      message: 'Research task created. Poll the status endpoint to check progress.'
    });

  } catch (error) {
    console.error('Deep research error:', error);
    return NextResponse.json({
      error: `Failed to perform deep research: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 });
  }
}