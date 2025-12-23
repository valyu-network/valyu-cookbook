## Extract clean and structured content from Web Pages

Turn any web page into clean, structured data. Returns clean markdown content for each URL.

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const data = await valyu.contents({
  urls: [
    "https://techcrunch.com/category/artificial-intelligence/",
  ],
  responseLength: "medium", // can be "short", "large", "max"
  extractEffort: "auto", // can be "normal", and "high" as well
});

console.log(data.results[0].content.slice(0, 500));
```

```python
from valyu import Valyu

valyu = Valyu(YOUR_VALYU_API_KEY_HERE)

data = valyu.contents(
    urls=[
        "https://techcrunch.com/category/artificial-intelligence/",
    ],
    response_length="medium",
    extract_effort="auto",
)

print(data["results"][0]["content"][:500])
```




