# Intel Espresso

Get instant, AI-powered briefings on any topic before your meeting. Enter a meeting topic or company name and receive a comprehensive 2-minute briefing with the latest news, key developments, and talking points.

![Intel Espresso](https://4ealzrotsszllxtz.public.blob.vercel-storage.com/intelespresso.gif)

## Features

- **Executive Summary**: Quick 2-minute read of the most important information
- **Key Developments**: Latest news and developments from the past 7 days
- **Key People**: Important people and leaders mentioned in recent news
- **Important Dates**: Upcoming events and recent milestones
- **Talking Points**: Prepared discussion points for your meeting
- **Source Links**: Direct links to all referenced news sources
- **Print-Friendly**: Generate professional briefings you can print or share

## Use Cases

- **Client Meetings**: Get up-to-date information on clients before meetings
- **Investor Meetings**: Latest developments on companies you're researching
- **Sales Calls**: Quick briefings on prospects and their companies
- **Team Meetings**: Prepare talking points on current projects or initiatives
- **Conference Prep**: Background on speakers, companies, or topics being discussed

## Setup

### Prerequisites

- Node.js 18+ installed
- A Valyu API key (get one at [https://valyu.io](https://valyu.io))

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```bash
VALYU_API_KEY=your_valyu_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Enter a meeting topic or company name in the search box
   - Examples: "Tesla Q4 earnings", "OpenAI latest developments", "Climate tech trends"
2. Click "Generate Meeting Brief"
3. Receive a comprehensive briefing in seconds with:
   - Executive summary
   - Key developments
   - Key people
   - Important dates
   - Talking points
   - Source links
4. Print or share the briefing with your team

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans & Geist Mono
- **API**: Valyu API with streaming support
- **Date Handling**: date-fns

## Project Structure

```
app/
├── api/
│   └── meeting-prep/
│       └── route.ts                # API route for Valyu integration
├── components/
│   ├── MeetingPrepAssistant.tsx    # Main application component
│   └── MeetingBriefCard.tsx        # Displays the generated brief
├── types/
│   └── meeting-prep.ts             # TypeScript type definitions
├── layout.tsx
└── page.tsx
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Make sure to add your `VALYU_API_KEY` environment variable in your Vercel project settings.

## License

MIT
