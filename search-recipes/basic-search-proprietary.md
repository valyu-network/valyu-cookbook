## Search high-quality proprietary data sources for an AI agent

Valyu has a lot of proprietary data sources that can be searched over for data. You can simply set the `searchType` parameter to `proprietary`.

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const response = await valyu.search({
  query: "latest developments in quantum computing",
  searchType: "proprietary",
});

response.results.forEach(result => {
  console.log(`Title: ${result.title}`);
  console.log(`URL: ${result.url}`);
  console.log(`Source: ${result.sourceType}`);
  console.log(`Content: ${result.content.substring(0, 200)}...`);
  console.log("---");
});
```

```python
from valyu import Valyu

valyu = Valyu(YOUR_VALYU_API_KEY_HERE)

response = valyu.search(
    query="latest developments in quantum computing",
    max_num_results=5,
    search_type="proprietary",
)

for result in response["results"]:
    print(f"Title: {result['title']}")
    print(f"URL: {result['url']}")
    print(f"Source: {result['source_type']}")
    print(f"Content: {result['content'][:200]}...")
    print("---")
```