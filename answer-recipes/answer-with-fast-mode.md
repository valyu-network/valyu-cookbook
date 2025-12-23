## Get AI-powered answers with Fast Mode for quicker results

The **Valyu Answer API** searches across web, academic, and financial sources, then uses AI to generate a readable response. 

Use fast mode for quicker responses. 

```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const data = await valyu.answer({
  query: "current market trends in tech stocks",
  fastMode: true,
  dataMaxPrice: 30.0
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