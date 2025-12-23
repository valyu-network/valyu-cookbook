## Search for Financial Data 

Search real-time market data, earnings reports, SEC filings, and regulatory updates. Valyu gives you structured financial data through a single API.

Multiple financial datasets are available for search. You can specify the dataset you want to query.

Available Valyu financial datasets that you can specify and target are:

### Market Data

1. `valyu/valyu-stocks`	- Real-time global stock prices	Live market monitoring
2. `valyu/valyu-crypto`	- Cryptocurrency prices	Crypto trading and analysis
3. `valyu/valyu-forex`	  - Foreign exchange rates	Currency trading and hedging
4. `valyu/valyu-etfs`	  - ETF prices and data	ETF trading and analysis
5. `valyu/valyu-funds`	  - Mutual fund prices	Fund research and tracking
6. `valyu/valyu-commodities` - Commodity futures prices

### Fundamental Analysis

1. `valyu/valyu-earnings-US`	- Quarterly and annual earnings	Performance analysis
2. `valyu/valyu-statistics-US`	Key - financial metrics and ratios	Quick company metrics
3. `valyu/valyu-balance-sheet-US`	- Balance sheet data	Financial health analysis
4. `valyu/valyu-income-statement-US`	- Revenue, expenses, profitability	Profitability assessment
5. `valyu/valyu-cash-flow-US` - Cash flow activities	Liquidity analysis
6. `valyu/valyu-dividends-US` - Dividend information

### Market Intelligence

1. `valyu/valyu-insider-transactions-US` - Executive and institutional trading	Sentiment analysis
2. `valyu/valyu-market-movers-US` - 	Biggest gainers, losers, most active

## Regulatory
1. `valyu/valyu-sec-filings` - SEC documents and regulatory filings	

### Economic Data

1. `valyu/valyu-destatis-labour` - German labour market statistics	German economic research
2. `valyu/valyu-fred` - Federal Reserve data (interest rates, GDP, inflation)	US economic analysis
3. `valyu/valyu-bls` - Bureau of Labor Statistics data	US labour market and inflation
4. `valyu/valyu-worldbank-indicators` - World Bank development indicators	Global economic research
5. `valyu/valyu-usaspending` - US federal spending data

### Target Specific Financial Datasets

```ts
import { Valyu } from 'valyu-js';

const valyu = new Valyu("your-api-key-here");

const earningsOnly = await valyu.search(
  "Tesla quarterly earnings",
  {
    includedSources: ['valyu/valyu-earnings-US']
  }
);

const comprehensive = await valyu.search(
  "Microsoft financial performance analysis",
  {
    includedSources: [
      'valyu/valyu-income-statement-US',
      'valyu/valyu-balance-sheet-US',
      'valyu/valyu-cash-flow-US'
    ]
  }
);
```

```python
from valyu import Valyu

valyu = Valyu("your-api-key-here")

# Just earnings data
earnings_only = valyu.search(
    "Tesla quarterly earnings",
    included_sources=["valyu/valyu-earnings-US"]
)

# Multiple financial datasets
comprehensive = valyu.search(
    "Microsoft financial performance analysis",
    included_sources=[
        "valyu/valyu-income-statement-US",
        "valyu/valyu-balance-sheet-US",
        "valyu/valyu-cash-flow-US"
    ]
)
```

### Financial News Platforms

Search over financial news platforms like so:

```typescript
import { Valyu } from 'valyu-js';

const valyu = new Valyu("your-api-key-here");

const response = await valyu.search(
  "Federal Reserve interest rate policy impact on banking sector",
  {
    includedSources: [
      'bloomberg.com',
      'reuters.com',
      'wsj.com',
      'federalreserve.gov'
    ]
  }
);
```

```python
from valyu import Valyu

valyu = Valyu("your-api-key-here")
response = valyu.search(
    "Federal Reserve interest rate policy impact on banking sector",
    included_sources=[
        "bloomberg.com",
        "reuters.com",
        "wsj.com",
        "federalreserve.gov"
    ]
)
```