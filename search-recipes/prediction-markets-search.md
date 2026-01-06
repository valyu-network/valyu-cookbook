# Prediction Markets Search for AI Agents

Real-time probability data from Polymarket and Kalshi. One API call.

```python
from valyu import Valyu

valyu = Valyu(api_key="your-key")

response = valyu.search(
    "What are the odds of a Fed rate cut in January 2025?",
    search_type="all"  # or "proprietary" for markets only
)
```

```tsx
import { Valyu } from "valyu-js";

const valyu = new Valyu("your-key");

const response = await valyu.search(
  "Who is favored to win the 2028 Republican presidential nomination?",
  { searchType: "all" }
);
```

Your agent asks a question in natural language. We return structured probability data: live prices, trading volume, and liquidity metrics.

---

## Why Prediction Markets Matter

Prediction markets aggregate information differently than polls or analyst forecasts. Participants stake money on outcomes, which creates a financial filter: uninformed opinions are expensive to hold, and private information gets priced in quickly.

The result is a continuous probability signal that updates in minutes rather than days.

In 2024, prediction markets [outperformed traditional polls](https://www.fastcompany.com/91224761/prediction-betting-market-2024-election-outcome-more-accurate-than-polling) in forecasting the U.S. presidential election, giving Trump 57% odds when polls showed a toss-up. [Academic analysis](https://arxiv.org/html/2507.08921) found Polymarket data superior to national polling in both accuracy and responsiveness to news events.

The institutional finance world has taken notice. ICE (parent of the NYSE) [invested $2 billion in Polymarket](https://www.nasdaq.com/articles/what-are-prediction-markets-future-real-time-trading-and-forecasting) at a $9 billion valuation. Kalshi raised $1 billion at $11 billion and now holds [over 60% of global market share](https://www.financemagnates.com/forex/analysis/kalshi-captures-60-market-share-ending-polymarkets-prediction-market-dominance/). This data is increasingly treated as a leading indicator alongside traditional market signals.

---

## What We Built

We integrated Polymarket and Kalshi into the Valyu Search API. Ask questions in natural language. Get structured probability data back.

**Automatic routing**: Use our standard search endpoint. When your query involves probabilities, odds, or future events, we include prediction market data alongside web and academic sources.

**Dedicated search**: Filter by source to query prediction markets exclusively.

---

## Market Coverage

| Category | Examples |
| --- | --- |
| Economics | Fed rate decisions, CPI prints, unemployment, recession odds |
| Finance | Earnings predictions, asset price targets, ETF approvals, M&A outcomes |
| Geopolitics | Ceasefire probabilities, leadership changes, territorial disputes |
| Technology | Product launches, acquisitions, regulatory rulings |
| Sports | NFL, NBA, MLB outcomes |
| Weather | Temperature thresholds, precipitation, hurricane paths |
| Entertainment | Award shows, box office, streaming milestones |

Markets spin up fast. When news breaks, prediction markets often appear within hours, giving you probability signals before polls or analysts weigh in.

---

## Targeting Specific Markets

### Polymarket - Earnings Predictions

```python
from valyu import Valyu
import json

valyu = Valyu(api_key="your-key")

response = valyu.search(
    "Get earnings odds from Polymarket",
    included_sources=["valyu/valyu-polymarket"],
    max_num_results=1
)

print(f"Success: {response.success}")
if response.results:
    r = response.results[0]
    print(f"Title: {r.title}")
    print(f"Source: {r.source}")
    print(f"URL: {r.url}")
    print(f"Content: {json.dumps(r.content, indent=2)}")
```

### Kalshi

```python
from valyu import Valyu
import json

valyu = Valyu(api_key="your-key")

response = valyu.search(
    "Bitcoin price prediction",
    included_sources=["valyu/valyu-kalshi"],
    max_num_results=1
)

print(f"Success: {response.success}")
if response.results:
    r = response.results[0]
    print(f"Title: {r.title}")
    print(f"Source: {r.source}")
    print(f"URL: {r.url}")
    print(f"Content: {json.dumps(r.content, indent=2)}")
```

### Natural Language Routing

No source filter needed - Valyu routes to prediction markets via natural language.

```python
from valyu import Valyu
import json

valyu = Valyu(api_key="your-key")

response = valyu.search(
    "Get odds from Polymarket on Democrats winning 2028 presidential election",
    max_num_results=1
)

print(f"Success: {response.success}")
if response.results:
    r = response.results[0]
    print(f"Title: {r.title}")
    print(f"Source: {r.source}")
    print(f"URL: {r.url}")
    print(f"Content: {json.dumps(r.content, indent=2)}")
```

---

## Response Format

```json
{
  "event_title": "Fed Interest Rate Decision - January 2025",
  "category": "Economics",
  "total_volume": 2847293.50,
  "total_liquidity": 158420.00,
  "markets": [
    {
      "title": "Will the Fed cut rates by 25bp?",
      "outcomes": [
        { "outcome": "Yes", "probability_pct": 68.5 },
        { "outcome": "No", "probability_pct": 31.5 }
      ],
      "volume_24h": 124500.00,
      "status": "active"
    }
  ],
  "url": "https://kalshi.com/events/FOMC-25JAN"
}
```

Real-time probabilities. Volume and liquidity metrics. Full probability distributions for multi-outcome markets. Source URLs for verification.

---

## Use Cases for AI Agents

**Research and analysis**: Query scenario probabilities for investment memos, risk reports, or strategic planning. "What's the market-implied probability of a 2025 recession?"

**Geopolitical intelligence**: The U.S. Army's Military Intelligence Professional Bulletin now [recognizes prediction markets](https://www.cfr.org/article/rise-geopolitical-prediction-markets) as a data source for threat assessment.

**News verification**: Compare breaking news against market-priced probabilities. If a rumor moves prediction markets, it carries more weight than unpriced speculation.

**Forecasting models**: Use market data as training signal or ground truth. These are crowd-priced probabilities with financial stakes, not sentiment scores.

---

## Get Started

**Playground**: Test queries before writing code at [ai-sdk.valyu.ai](https://ai-sdk.valyu.ai/)

**API Key**: Get $10 free credits at [platform.valyu.ai](https://platform.valyu.ai/)

**Docs**: [docs.valyu.ai](https://docs.valyu.ai/)

**MCP**: Connect Claude Desktop directly at `https://mcp.valyu.ai/mcp?valyuApiKey=your-key`
