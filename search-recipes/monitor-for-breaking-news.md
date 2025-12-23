## Breaking News Tracker

Monitor for breaking news on specific topics:

_TypeScript_
```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu();

async function breakingNews(topics: string[], hoursBack: number = 24) {
  const today = new Date().toISOString().split("T")[0];

  console.log(`=== Breaking News (${today}) ===\n`);

  for (const topic of topics) {
    const response = await valyu.search({
      query: `${topic} breaking news today`,
      searchType: "news",
      maxNumResults: 10,
      startDate: today,
      endDate: today,
    });

    if (response.success && response.results.length > 0) {
      console.log(`🔴 ${topic.toUpperCase()}`);
      response.results.slice(0, 3).forEach(article => {
        console.log(`   • ${article.title}`);
        console.log(`     ${article.url}`);
      });
      console.log();
    }
  }
}

// Track breaking news
await breakingNews([
  "stock market",
  "federal reserve",
  "technology",
  "politics"
]);
```

```python
from valyu import Valyu
from datetime import datetime

valyu = Valyu()

def breaking_news(topics: list, hours_back: int = 24):
    """Get recent breaking news on topics."""
    
    # Use today's date for recent news
    today = datetime.now().strftime("%Y-%m-%d")
    
    print(f"=== Breaking News ({today}) ===\n")
    
    for topic in topics:
        response = valyu.search(
            query=f"{topic} breaking news today",
            search_type="news",
            max_num_results=10,
            start_date=today,
            end_date=today,
        )
        
        if response.get("success") and response["results"]:
            print(f"🔴 {topic.upper()}")
            for article in response["results"][:3]:
                print(f"   • {article['title']}")
                print(f"     {article['url']}")
            print()

# Track breaking news
breaking_news([
    "stock market",
    "federal reserve",
    "technology",
    "politics"
])
```