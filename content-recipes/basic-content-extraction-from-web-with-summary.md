## Extract clean and structured content from Web Pages with Summary

Turn any web page into clean, structured data with summary. There's a `summary` parameter you can pass as an option. 

With the `summary` option set to true, it returns a basic summary. Set it to false, and it won't process any summary.

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const data = await valyu.contents({
  urls: [
    "https://example.com/article",
  ],
  responseLength: "medium", // can be "short", "large", "max"
  extractEffort: "auto", // can be "normal", and "high" as well
  summary: true
});

console.log(data.results[0].content.slice(0, 500));
```

```python
from valyu import Valyu

valyu = Valyu(YOUR_VALYU_API_KEY_HERE)

data = valyu.contents(
    urls=[
        "https://example.com/article",
    ],
    response_length="medium",
    extract_effort="auto",
    summary=True
)

print(data["results"][0]["content"][:500])
```

## Instruct the search to return a custom summary (essentially how you'd like the summary to be).

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const data = await valyu.contents({
  urls: ["https://example.com/research-paper"],
  extractEffort: "auto",
  summary: "Summarise the methodology, key findings, and practical applications in 2-3 paragraphs",
});

console.log(data.results[0].content);
```

```python
from valyu import Valyu

valyu = Valyu()

data = valyu.contents(
    urls=["https://example.com/research-paper"],
    extract_effort="auto",
    summary="Summarise the methodology, key findings, and practical applications in 2-3 paragraphs",
)

print(data["results"][0]["content"])
```


