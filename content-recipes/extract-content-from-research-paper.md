## Extract Structured Academic data from a Research Paper

Extract structured academic data from a research paper on https://arxiv.org.

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const data = await valyu.contents({
  "urls": ["https://arxiv.org/paper/example"],
  "response_length": "max",
  "extract_effort": "high",
  "summary": {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "abstract": { "type": "string" },
      "methodology": { "type": "string" },
      "key_findings": {
        "type": "array",
        "items": { "type": "string" }
      },
      "limitations": { "type": "string" }
    },
    "required": ["title"]
  }
});

console.log(data.results[0].content);
```

