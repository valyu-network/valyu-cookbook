## Search for News and Track Coverage across topics

Search real-time news articles with date and country filtering. News mode is optimised for finding current events, breaking news, and journalism content.

Search for news articles on any topic:

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY); 

const response = await valyu.search({
  query: "artificial intelligence regulation updates",
  searchType: "news",
  maxNumResults: 20,
});

response.results.forEach(result => {
  console.log(`Title: ${result.title}`);
  console.log(`Date: ${result.publicationDate || "N/A"}`);
  console.log(`URL: ${result.url}`);
  console.log("---");
});
```

```python
from valyu import Valyu

valyu = Valyu()  # Uses VALYU_API_KEY from env

response = valyu.search(
    query="artificial intelligence regulation updates",
    search_type="news",
    max_num_results=20,
)

for result in response["results"]:
    print(f"Title: {result['title']}")
    print(f"Date: {result.get('publication_date', 'N/A')}")
    print(f"URL: {result['url']}")
    print("---")
```

Filter news by publication date range:

```typescript
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY);

const response = await valyu.search({
  query: "climate change policy announcements",
  searchType: "news",
  maxNumResults: 50,
  startDate: "2025-01-01",
  endDate: "2025-12-31",
});

console.log(`Found ${response.results.length} articles from 2025`);

response.results.slice(0, 5).forEach(result => {
  console.log(`${result.publicationDate || "N/A"}: ${result.title}`);
});
```

```python
from valyu import Valyu

valyu = Valyu()

response = valyu.search(
    query="climate change policy announcements",
    search_type="news",
    max_num_results=50,
    start_date="2025-01-01",
    end_date="2025-12-31",
)

print(f"Found {len(response['results'])} articles from 2025")

for result in response["results"][:5]:
    print(f"{result.get('publication_date', 'N/A')}: {result['title']}")
```

Focus on news from specific countries using their country code as filter:

```typescript
import { Valyu } from "valyu-js";

const valyu = new Valyu();

// US news
const usNews = await valyu.search({
  query: "technology startup funding rounds",
  searchType: "news",
  maxNumResults: 30,
  countryCode: "US",
});

// UK news
const ukNews = await valyu.search({
  query: "technology startup funding rounds",
  searchType: "news",
  maxNumResults: 30,
  countryCode: "GB",
});

console.log(`US articles: ${usNews.results.length}`);
console.log(`UK articles: ${ukNews.results.length}`);
```

```python
from valyu import Valyu

valyu = Valyu()

# US news
us_news = valyu.search(
    query="technology startup funding rounds",
    search_type="news",
    max_num_results=30,
    country_code="US",
)

# UK news
uk_news = valyu.search(
    query="technology startup funding rounds",
    search_type="news",
    max_num_results=30,
    country_code="GB",
)

print(f"US articles: {len(us_news['results'])}")
print(f"UK articles: {len(uk_news['results'])}")
```