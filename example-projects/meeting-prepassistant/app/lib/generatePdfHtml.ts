import { MeetingPrepResult } from "@/app/types/meeting-prep";

export function generatePdfHtml(result: MeetingPrepResult): string {
  const { topic, generatedAt, brief, sources } = result;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(topic)} - Meeting Brief</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background: white;
        padding: 40px;
        font-size: 11pt;
      }

      .header {
        border-bottom: 3px solid #de5833;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }

      .title {
        font-size: 24pt;
        font-weight: 700;
        color: #111827;
        margin-bottom: 8px;
      }

      .meta {
        font-size: 10pt;
        color: #6b7280;
        font-weight: 500;
      }

      .section {
        margin-bottom: 25px;
        page-break-inside: avoid;
      }

      .section-title {
        font-size: 14pt;
        font-weight: 700;
        color: #111827;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .section-icon {
        font-size: 16pt;
      }

      .executive-summary {
        background: #f9fafb;
        padding: 20px;
        border-left: 4px solid #de5833;
        border-radius: 4px;
      }

      .executive-summary p {
        line-height: 1.8;
        color: #374151;
      }

      .list-item {
        margin-bottom: 10px;
        padding: 12px 15px 12px 12px;
        background: #f9fafb;
        border-radius: 4px;
        border-left: 3px solid #d1d5db;
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }

      .bullet {
        color: #de5833;
        font-weight: bold;
        font-size: 14pt;
        flex-shrink: 0;
      }

      .people-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .person-tag {
        display: inline-block;
        padding: 6px 14px;
        background: #e5e7eb;
        color: #1f2937;
        border-radius: 20px;
        font-size: 10pt;
        font-weight: 600;
        border: 1px solid #d1d5db;
      }

      .source-item {
        margin-bottom: 15px;
        padding: 12px 15px;
        background: #f9fafb;
        border-left: 4px solid #9ca3af;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      .source-title {
        color: #de5833;
        font-weight: 600;
        font-size: 10.5pt;
        margin-bottom: 4px;
      }

      .source-date {
        font-size: 9pt;
        color: #6b7280;
        margin-bottom: 6px;
      }

      .source-snippet {
        font-size: 10pt;
        color: #4b5563;
        line-height: 1.5;
      }

      .source-url {
        margin-top: 4px;
        font-size: 9pt;
        color: #9ca3af;
      }

      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid #e5e7eb;
        text-align: center;
        font-size: 9pt;
        color: #9ca3af;
      }

      .footer p {
        margin: 0;
      }

      .footer p + p {
        margin-top: 4px;
      }

      @media print {
        body {
          padding: 30px;
        }

        .section {
          page-break-inside: avoid;
        }

        .executive-summary {
          page-break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1 class="title">${escapeHtml(topic)}</h1>
      <p class="meta">Generated: ${formatDate(generatedAt)}</p>
    </div>

    <div class="section">
      <h2 class="section-title">
        <span class="section-icon">📋</span>
        Executive Summary
      </h2>
      <div class="executive-summary">
        <p>${escapeHtml(brief.executiveSummary)}</p>
      </div>
    </div>

    ${
      brief.keyDevelopments.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">
        <span class="section-icon">📰</span>
        Key Developments
      </h2>
      <div>
        ${brief.keyDevelopments
          .map(
            (dev) => `
        <div class="list-item">
          <span class="bullet">•</span>
          <span>${escapeHtml(dev)}</span>
        </div>`
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    ${
      brief.keyPeople.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">
        <span class="section-icon">👥</span>
        Key People
      </h2>
      <div class="people-tags">
        ${brief.keyPeople
          .map(
            (person) => `
        <span class="person-tag">${escapeHtml(person)}</span>`
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    ${
      brief.importantDates.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">
        <span class="section-icon">📅</span>
        Important Dates
      </h2>
      <div>
        ${brief.importantDates
          .map(
            (date) => `
        <div class="list-item">
          <span class="bullet">•</span>
          <span>${escapeHtml(date)}</span>
        </div>`
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    ${
      brief.talkingPoints.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">
        <span class="section-icon">💬</span>
        Talking Points
      </h2>
      <div>
        ${brief.talkingPoints
          .map(
            (point) => `
        <div class="list-item">
          <span class="bullet">•</span>
          <span>${escapeHtml(point)}</span>
        </div>`
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    ${
      sources.length > 0
        ? `
    <div class="section">
      <h2 class="section-title">
        <span class="section-icon">🔗</span>
        Sources
      </h2>
      <div>
        ${sources
          .slice(0, 8)
          .map(
            (source) => `
        <div class="source-item">
          <div class="source-title">${escapeHtml(source.title)}</div>
          ${
            source.publishedDate
              ? `<div class="source-date">${new Date(
                  source.publishedDate
                ).toLocaleDateString()}</div>`
              : ""
          }
          ${
            source.snippet
              ? `<div class="source-snippet">${escapeHtml(source.snippet)}</div>`
              : ""
          }
          <div class="source-url">${escapeHtml(source.url)}</div>
        </div>`
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <div class="footer">
      <p>Generated with Intel Espresso • Powered by Valyu API</p>
      <p>https://platform.valyu.ai</p>
    </div>
  </body>
</html>
  `;
}
