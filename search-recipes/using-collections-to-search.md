## Use Collections for Search

Collections let you save groups of sources and reference them by name in API calls. Instead of listing multiple sources every time, create a collection once and reuse it across all your searches.

1. Head over to your [dashboard](https://platform.valyu.ai)
2. Go to Collections
3. Click Create Collection
4. Add sources (Valyu datasets, domains, or URLs)
5. Save with a memorable name

```typescript
import { Valyu } from 'valyu-js';

const valyu = new Valyu();

const response = await valyu.search(
  "latest quarterly earnings reports",
  {
    includedSources: ["collection:my-finance-sources"]
  }
);
```

```python
from valyu import Valyu

valyu = Valyu()
response = valyu.search(
    query="latest quarterly earnings reports",
    included_sources=["collection:my-finance-sources"]
)
```

### Combine Collections with Normal Sources

```typescript
import { Valyu } from 'valyu-js';

const valyu = new Valyu();

const response = await valyu.search(
  "biotech company clinical trial results",
  {
    includedSources: [
      "collection:medical-research",
      "techcrunch.com",
      "valyu/valyu-patents"
    ]
  }
);
```

```python
from valyu import Valyu

valyu = Valyu()
response = valyu.search(
    query="biotech company clinical trial results",
    included_sources=[
        "collection:medical-research",  # Your saved collection
        "techcrunch.com",                # Additional domain
        "valyu/valyu-patents"            # Additional dataset
    ]
)
```