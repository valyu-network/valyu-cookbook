import { NextRequest, NextResponse } from 'next/server';
import { Valyu } from "valyu-js";

const valyu = new Valyu();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Get the status of the research task
    const result = await valyu.deepresearch.status(taskId);

    // Log progress for debugging
    if (result.progress) {
      console.log(`Progress: ${result.progress.current_step}/${result.progress.total_steps}`);
    }

    return NextResponse.json({
      success: true,
      deepresearch_id: result.deepresearch_id,
      status: result.status,
      output: result.output,
      sources: result.sources,
      usage: result.usage,
      pdf_url: result.pdf_url,
      progress: result.progress // Include progress information
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({
      error: `Failed to check status: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 });
  }
}
