## Structured Content Extraction from Web Pages

Specify the structure of the content extraction from any URL.

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const data = await valyu.contents({
  urls: ["https://example.com/product-page"],
  maxPriceDollars: 0.1,
  extractEffort: "auto",
  summary: {
    type: "object",
    properties: {
      product_name: { type: "string", description: "Name of the product" },
      price: { type: "number", description: "Product price in USD" },
      features: {
        type: "array",
        items: { type: "string" },
        maxItems: 5,
        description: "Key product features",
      },
      availability: {
        type: "string",
        enum: ["in_stock", "out_of_stock", "preorder"],
        description: "Product availability status",
      },
    },
    required: ["product_name", "price"],
  },
});

console.log(data.results[0].content);
```

```python
from valyu import Valyu

valyu = Valyu(YOUR_VALYU_API_KEY_HERE)

data = valyu.contents(
    urls=["https://example.com/product-page"],
    extract_effort="auto",
    summary={
        "type": "object",
        "properties": {
            "product_name": {"type": "string", "description": "Name of the product"},
            "price": {"type": "number", "description": "Product price in USD"},
            "features": {
                "type": "array",
                "items": {"type": "string"},
                "maxItems": 5,
                "description": "Key product features",
            },
            "availability": {
                "type": "string",
                "enum": ["in_stock", "out_of_stock", "preorder"],
                "description": "Product availability status",
            },
        },
        "required": ["product_name", "price"],
    },
)

print(data["results"][0]["content"])
```




