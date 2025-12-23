## Get AI-powered answers with Custom Instructions

Tell the AI how to process and format the answer via the `systemInstructions` parameter. 

The `systemInstructions` option allows you to pass in a description of how you'd like the AI to process your query.


```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

const data = await valyu.answer({
  query: "climate change research",
  systemInstructions: "Focus on practical applications and commercial impact. Summarise key findings as bullet points.",
});

console.log(data.contents);
```
_TypeScript_


```python
from valyu import Valyu

valyu = Valyu()

data = valyu.answer(
    query="climate change research",
    system_instructions="Focus on practical applications and commercial impact. Summarise key findings as bullet points.",
)
print(data["contents"])
```
_Python_