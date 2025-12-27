# Taiwan GC331 Exchange Rate Fetcher

This project fetches Taiwan's monthly exchange rate data (GC331) from the official government API and stores it locally.

## Features

- Fetches exchange rate data from the Taiwan government API
- Saves current data to `gc331_current.json`
- Archives historical data to `histories/{start}.json`
- Automated execution via GitHub Actions on the 5th, 15th, and 25th of each month

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the fetcher:
```bash
npm start
```

## GitHub Actions

The workflow is configured to run automatically on:
- 5th of every month at 00:00 UTC (08:00 Taiwan Time)
- 15th of every month at 00:00 UTC (08:00 Taiwan Time)
- 25th of every month at 00:00 UTC (08:00 Taiwan Time)

You can also trigger it manually from the Actions tab in GitHub.

## Data Structure

The fetched JSON contains:
- `start`: Start date of the period (YYYYMMDD)
- `end`: End date of the period (YYYYMMDD)
- `items`: Array of exchange rates for various currencies
  - `code`: Currency code
  - `buyValue`: Buy rate
  - `sellValue`: Sell rate

## License

MIT

