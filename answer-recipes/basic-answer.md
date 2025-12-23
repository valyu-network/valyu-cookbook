## Get AI-powered answers with real-time search

The **Valyu Answer API** searches across web, academic, and financial sources, then uses AI to generate a readable response. 

You get an answer instead of raw search results.

Ask a question and get an AI-generated answer:

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const data = await valyu.answer({
  query: "latest developments in quantum computing",
});

console.log(data.contents);
```
_TypeScript_


```python
from valyu import Valyu

valyu = Valyu() # Uses VALYU_API_KEY from env

data = valyu.answer(
    query="latest developments in quantum computing",
)
print(data["contents"])
```
_Python_