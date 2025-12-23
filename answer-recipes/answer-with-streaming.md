## Get AI-powered answers with streaming enabled

Enable streaming to receive the answer progressively as it’s generated. The stream sends search results first, then content chunks, then metadata.

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

// Streaming mode - returns async generator
const stream = await valyu.answer("What is machine learning?", { streaming: true });

for await (const chunk of stream) {
  if (chunk.type === "search_results") {
    console.log(`Found ${chunk.search_results?.length} sources`);
  } else if (chunk.type === "content") {
    if (chunk.content) {
      process.stdout.write(chunk.content);
    }
  } else if (chunk.type === "metadata") {
    console.log(`\nCost: $${chunk.cost?.total_deduction_dollars.toFixed(4)}`);
  } else if (chunk.type === "done") {
    console.log("\n[Complete]");
  } else if (chunk.type === "error") {
    console.error(`Error: ${chunk.error}`);
  }
}
```
_TypeScript_


```python
from valyu import Valyu

valyu = Valyu()

data = valyu.answer(
    query="top tech companies financial performance 2024",
    structured_output={
        "type": "object",
        "properties": {
            "companies": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "revenue": {"type": "string"},
                        "growth_rate": {"type": "string"},
                        "key_metrics": {"type": "array", "items": {"type": "string"}},
                    },
                    "required": ["name", "revenue"],
                },
            },
            "market_summary": {"type": "string"},
            "analysis_date": {"type": "string"},
        },
        "required": ["companies", "market_summary"],
    },
)
print(data["contents"])
```
_Python_