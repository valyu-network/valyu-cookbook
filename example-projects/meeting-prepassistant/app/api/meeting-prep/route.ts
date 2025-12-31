import { NextRequest, NextResponse } from "next/server";
import { Valyu } from "valyu-js";

export const maxDuration = 800;

const valyu = new Valyu();

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    const data: any = await valyu.answer(
      `Latest news and key developments about ${topic}`,
      {
        startDate: formatDate(sevenDaysAgo),
        endDate: formatDate(today),
        searchType: "news",
        structuredOutput: {
          type: "object",
          properties: {
            executive_summary: {
              type: "string",
              description: "2-minute read summary of key information",
            },
            key_developments: {
              type: "array",
              items: { type: "string" },
              description: "List of recent key developments or news",
            },
            key_people: {
              type: "array",
              items: { type: "string" },
              description: "Key people or leaders mentioned",
            },
            important_dates: {
              type: "array",
              items: { type: "string" },
              description: "Important upcoming dates or recent events",
            },
            talking_points: {
              type: "array",
              items: { type: "string" },
              description: "Key talking points to prepare",
            },
          },
        },
      }
    );

    if (!data.success) {
      throw new Error("Failed to generate meeting brief");
    }

    const briefData =
      typeof data.contents === "string"
        ? JSON.parse(data.contents)
        : data.contents;

    const result = {
      topic,
      generatedAt: new Date().toISOString(),
      brief: {
        executiveSummary: briefData.executive_summary || "",
        keyDevelopments: briefData.key_developments || [],
        keyPeople: briefData.key_people || [],
        importantDates: briefData.important_dates || [],
        talkingPoints: briefData.talking_points || [],
      },
      sources:
        data.search_results?.map((result: any) => ({
          title: result.title,
          url: result.url,
          publishedDate: result.publication_date,
          snippet: result.description,
        })) || [],
    };

    console.log("Executive Summary", result)

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
