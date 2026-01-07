import { NextRequest, NextResponse } from 'next/server';
import { Valyu } from "valyu-js";

const valyu = new Valyu();

export async function POST(req: NextRequest) {
  try {
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Cancel the deep research task
    const result = await valyu.deepresearch.cancel(taskId);

    console.log("Cancellation result:", result);

    // Handle cases where task is already cancelled or completed
    if (!result.success && result.error) {
      // If task is already cancelled or completed, treat as success
      if (result.error.includes('cancelled') || result.error.includes('completed')) {
        return NextResponse.json({
          success: true,
          deepresearch_id: taskId,
          status: 'cancelled',
          message: 'Task was already cancelled or completed'
        });
      }
    }

    return NextResponse.json({
      success: true,
      deepresearch_id: taskId,
      status: 'cancelled',
      message: 'Research task cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel task error:', error);
    return NextResponse.json({
      error: `Failed to cancel task: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 });
  }
}
