## Extract Product Data

Extract product data from an online store.

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const data = await valyu.contents({
  "urls": ["https://company.com/product-A", "https://company.com/product-B"],
  "extract_effort": "auto",
  "summary": {
    "type": "object",
    "properties": {
      "product_name": { "type": "string" },
      "features": {
        "type": "array",
        "items": { "type": "string" }
      },
      "pricing": { "type": "string" },
      "target_audience": { "type": "string" }
    },
    "required": ["product_name"]
  }
});

console.log(data.results[0].content);
```

