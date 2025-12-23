## Search for Academic Data

Search peer-reviewed papers, academic journals, and scholarly datasets. Useful for literature reviews, research validation, and exploring developments in any field.

Available datasets that you can specify and target are:

`valyu/valyu-arxiv` - ArXiv preprints and papers	Latest research across all fields
`valyu/valyu-pubmed` - Medical and life sciences literature	Healthcare and biomedical research
`wiley/wiley-finance-papers` - Finance and economics papers	Finance and economics research
`valyu/valyu-biorxiv` - Life sciences preprints from BioRxiv	Latest life sciences research
`valyu/valyu-medrxiv` - Health and clinical research preprints from medRxiv

### Target Specific Datasets

```ts
import { Valyu } from 'valyu-js';

const valyu = new Valyu("your-api-key-here");

const response = await valyu.search(
  'CRISPR gene editing therapeutic applications',
  {
    includedSources: [
      'valyu/valyu-pubmed',
      'valyu/valyu-arxiv',
      'nature.com',
      'science.org'
    ],
  }
);
```

```python
from valyu import Valyu

valyu = Valyu("your-api-key-here")
response = valyu.search(
    "CRISPR gene editing therapeutic applications",
    included_sources=[
        "valyu/valyu-pubmed",
        "valyu/valyu-arxiv",
        "nature.com",
        "science.org"
    ],
)
```

Filter the search by date:

```typescript
import { Valyu } from 'valyu-js';

const valyu = new Valyu("your-api-key-here");

const response = await valyu.search(
  'peer-reviewed studies on climate change mitigation strategies',
  {
    includedSources: [
      'valyu/valyu-arxiv',
      'valyu/valyu-pubmed'
    ],
    startDate: '2024-01-01',
    responseLength: 'large',
    maxNumResults: 15
  }
);
```

```python
from valyu import Valyu

valyu = Valyu("your-api-key-here")
response = valyu.search(
    "peer-reviewed studies on climate change mitigation strategies",
    included_sources=[
        "valyu/valyu-arxiv",
        "valyu/valyu-pubmed"
    ],
    start_date="2024-01-01",
    response_length="large",
    max_num_results=15
)
```

## Compare Research Periods

```typescript
import { Valyu } from 'valyu-js';

const valyu = new Valyu("your-api-key-here");

// Early research
const earlyResearch = await valyu.search(
  'neural network architectures and applications',
  {
    includedSources: ['valyu/valyu-arxiv'],
    startDate: '1990-01-01',
    endDate: '2005-12-31'
  }
);

// Modern research
const modernResearch = await valyu.search(
  'neural network architectures and applications',
  {
    includedSources: ['valyu/valyu-arxiv'],
    startDate: '2020-01-01'
  }
);
```

```python
from valyu import Valyu

valyu = Valyu("your-api-key-here")

# Early research
early_research = valyu.search(
    "neural network architectures and applications",
    included_sources=["valyu/valyu-arxiv"],
    start_date="1990-01-01",
    end_date="2005-12-31"
)

# Modern research
modern_research = valyu.search(
    "neural network architectures and applications",
    included_sources=["valyu/valyu-arxiv"],
    start_date="2020-01-01"
)
```

## Computer Science

```typescript
import { Valyu } from 'valyu-js';

const valyu = new Valyu("your-api-key-here");

const response = await valyu.search(
  'transformer architecture improvements large language models',
  {
    includedSources: [
      'valyu/valyu-arxiv',
      'openai.com',
      'deepmind.com',
      'aclweb.org'
    ],
    startDate: '2024-01-01',
    searchType: 'proprietary'
  }
);
```

```python
from valyu import Valyu

valyu = Valyu("your-api-key-here")
response = valyu.search(
    "transformer architecture improvements large language models",
    included_sources=[
        "valyu/valyu-arxiv",
        "openai.com",
        "deepmind.com",
        "aclweb.org"
    ],
    start_date="2024-01-01",
    search_type="proprietary"
)
```

## Environmental Science

```typescript
import { Valyu } from 'valyu-js';

const valyu = new Valyu("your-api-key-here");

const response = await valyu.search(
  'carbon capture technology effectiveness peer-reviewed studies',
  {
    includedSources: [
      'valyu/valyu-arxiv',
      'nature.com',
      'science.org',
      'iopscience.iop.org'
    ],
    responseLength: 'large',
    maxNumResults: 20
  }
);
```

```python
from valyu import Valyu

valyu = Valyu("your-api-key-here")
response = valyu.search(
    "carbon capture technology effectiveness peer-reviewed studies",
    included_sources=[
        "valyu/valyu-arxiv",
        "nature.com",
        "science.org",
        "iopscience.iop.org"
    ],
    response_length="large",
    max_num_results=20
)
```
