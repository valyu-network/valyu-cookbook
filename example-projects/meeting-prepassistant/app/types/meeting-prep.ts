export interface MeetingBrief {
  executiveSummary: string;
  keyDevelopments: string[];
  keyPeople: string[];
  importantDates: string[];
  talkingPoints: string[];
}

export interface MeetingPrepSource {
  title: string;
  url: string;
  publishedDate?: string;
  snippet?: string;
}

export interface MeetingPrepResult {
  topic: string;
  generatedAt: string;
  brief: MeetingBrief;
  sources: MeetingPrepSource[];
}
