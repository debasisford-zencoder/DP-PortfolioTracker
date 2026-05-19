# DP Portfolio Tracker

A modern stock portfolio management application to track up to 30 stock investments.

## Features

- **Dashboard Overview** — total stocks, portfolio theme, invested value, current value & P&L
- **Stock Management** — add, edit, and delete positions (up to 30 stocks)
- **Smart Recommendations** — automatic Buy More / Hold / Sell badges based on performance
- **Holding Period** — calculated automatically from the buy date
- **Responsive Design** — clean dark-themed UI

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Storage | JSON file-based persistence |

## Getting Started

### Prerequisites
- Node.js 18+

### 1 — Start the Backend

```bash
cd backend
npm install
npm start        # production
npm run dev      # development (nodemon)
```

API runs on **http://localhost:3001**

### 2 — Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at **http://localhost:5173**

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks` | List all stocks (enriched) |
| POST | `/api/stocks` | Add a stock |
| PUT | `/api/stocks/:id` | Update a stock |
| DELETE | `/api/stocks/:id` | Delete a stock |
| GET | `/api/settings` | Get portfolio settings |
| PUT | `/api/settings` | Update portfolio settings |
| GET | `/api/portfolio` | Aggregated portfolio summary |

## Recommendation Logic

| Signal | Condition |
|--------|-----------|
| **Buy More** | P&L% < -10% |
| **Hold** | -10% ≤ P&L% ≤ +20% |
| **Sell** | P&L% > +20% |
