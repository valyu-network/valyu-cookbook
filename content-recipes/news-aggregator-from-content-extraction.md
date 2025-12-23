## Make a News Aggregator

Extract structured article data from techcrunch, venturebeat and bbc. And make a summary from the three articles.

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const data = await valyu.contents({
  "urls": [
    "https://techcrunch.com/category/artificial-intelligence/",
    "https://venturebeat.com/category/entrepreneur/",
    "https://www.bbc.co.uk/news/technology"
  ],
  "extract_effort": "auto",
  "summary": {
    "type": "object",
    "properties": {
      "headline": { "type": "string" },
      "summary_text": { "type": "string" },
      "category": { "type": "string" },
      "tags": {
        "type": "array",
        "items": { "type": "string" },
        "maxItems": 5
      }
    },
    "required": ["headline"]
  }
});

console.log(data.results[0].content);
```





