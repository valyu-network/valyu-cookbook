## Search high-quality web data for an AI agent

You can search for high-quality data from the web via the `searchType` set to `web`.

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const response = await valyu.search({
  query: "latest developments in quantum computing",
  searchType: "web",
});

response.results.forEach(result => {
  console.log(`Title: ${result.title}`);
  console.log(`URL: ${result.url}`);
  console.log(`Source: ${result.sourceType}`);
  console.log(`Content: ${result.content.substring(0, 200)}...`);
  console.log("---");
});