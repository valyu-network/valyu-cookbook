## Search for Healthcare & Biomedical Data 

Search clinical trials, drug information, scientific literature, and pharmaceutical data. Valyu gives you authoritative medical information through a single API.

Available healthcare and biomedical datasets that you can specify and target are:

### Clinical Research

`valyu/valyu-clinical-trials` - Clinical trials from ClinicalTrials.gov	Trial monitoring and enrolment
`valyu/valyu-drug-labels` - FDA drug labels from DailyMed	Drug safety and prescribing
`valyu/valyu-pubmed` - Biomedical literature from PubMed	Scientific research
`valyu/valyu-arxiv` - Pre-print scientific papers	Latest research
`valyu/valyu-biorxiv` - Life sciences preprints	Life sciences research
`valyu/valyu-medrxiv` - Health and clinical research preprints

### Pharmaceutical Business

`valyu/valyu-sec-filings` - Pharmaceutical company SEC documents	Business strategy and pipeline
`valyu/valyu-stocks` - Pharma stock prices and performance	Market analysis
`valyu/valyu-earnings-US` - Quarterly earnings reports

### Target Specific Datasets

```ts
import { Valyu } from 'valyu-js';

const valyu = new Valyu("your-api-key-here");

const response = await valyu.search(
  "Phase 3 melanoma immunotherapy trials currently recruiting",
  {
    includedSources: ['valyu/valyu-clinical-trials']
  }
);

const trialDetails = await valyu.search("clinical trial NCT04916431 detailed protocol");
```

```python
from valyu import Valyu

valyu = Valyu("your-api-key-here")

response = valyu.search(
    "Phase 3 melanoma immunotherapy trials currently recruiting",
    included_sources=["valyu/valyu-clinical-trials"]
)

# Get trial details by NCT ID
trial_details = valyu.search(
    "clinical trial NCT04916431 detailed protocol"
)
```

### Biomedical Literature

Search over biomedical literature like so:

```typescript
import { Valyu } from 'valyu-js';

const valyu = new Valyu("your-api-key-here");

const crisprResearch = await valyu.search(
  "CRISPR-Cas9 off-target effects safety studies 2024",
  {
    includedSources: ['valyu/valyu-pubmed', 'valyu/valyu-arxiv'],
    maxNumResults: 10
  }
);

const covidStudies = await valyu.search(
  "COVID-19 long-term neurological effects peer-reviewed studies",
  {
    startDate: "2023-01-01",
    endDate: "2024-12-31"
  }
);
```

```python
from valyu import Valyu

valyu = Valyu("your-api-key-here")

# CRISPR research
crispr_research = valyu.search(
    "CRISPR-Cas9 off-target effects safety studies 2024",
    included_sources=["valyu/valyu-pubmed", "valyu/valyu-arxiv"],
    max_num_results=10
)

# COVID-19 studies
covid_studies = valyu.search(
    "COVID-19 long-term neurological effects peer-reviewed studies",
    start_date="2023-01-01",
    end_date="2024-12-31"
)
```

### Pharma Company Analysis

```typescript
import { Valyu } from 'valyu-js';

const valyu = new Valyu("your-api-key-here");

const pfizerAnalysis = await valyu.search(
  "Pfizer oncology pipeline clinical trials SEC filings 2024",
  {
    includedSources: [
      'valyu/valyu-sec-filings',
      'valyu/valyu-clinical-trials',
      'valyu/valyu-stocks'
    ]
  }
);

const pipeline = await valyu.search("Moderna mRNA vaccine pipeline development Phase 2 Phase 3 trials");
```

```python
from valyu import Valyu

valyu = Valyu("your-api-key-here")

pfizer_analysis = valyu.search(
    "Pfizer oncology pipeline clinical trials SEC filings 2024",
    included_sources=[
        "valyu/valyu-sec-filings",
        "valyu/valyu-clinical-trials",
        "valyu/valyu-stocks"
    ]
)

pipeline = valyu.search(
    "Moderna mRNA vaccine pipeline development Phase 2 Phase 3 trials"
)
```