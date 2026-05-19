const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

const DATA_DIR = path.join(__dirname, 'data');
const STOCKS_FILE = path.join(DATA_DIR, 'stocks.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(STOCKS_FILE)) fs.writeFileSync(STOCKS_FILE, JSON.stringify([], null, 2));
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
    theme: 'My Portfolio',
    description: 'Track your stock investments'
  }, null, 2));
}

app.use(cors());
app.use(express.json());

const readStocks = () => JSON.parse(fs.readFileSync(STOCKS_FILE, 'utf-8'));
const writeStocks = (data) => fs.writeFileSync(STOCKS_FILE, JSON.stringify(data, null, 2));
const readSettings = () => JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
const writeSettings = (data) => fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));

const getRecommendation = (buyPrice, currentPrice) => {
  const pct = ((currentPrice - buyPrice) / buyPrice) * 100;
  if (pct < -10) return 'Buy More';
  if (pct > 20) return 'Sell';
  return 'Hold';
};

const enrichStock = (stock) => {
  const investedValue = stock.quantity * stock.buyPrice;
  const currentValue = stock.quantity * stock.currentPrice;
  const pnl = currentValue - investedValue;
  const pnlPercent = ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100;

  const diffDays = Math.ceil(
    Math.abs(new Date() - new Date(stock.buyDate)) / (1000 * 60 * 60 * 24)
  );
  let holdingPeriod;
  if (diffDays < 30) {
    holdingPeriod = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const m = Math.floor(diffDays / 30);
    holdingPeriod = `${m} month${m !== 1 ? 's' : ''}`;
  } else {
    const y = Math.floor(diffDays / 365);
    const m = Math.floor((diffDays % 365) / 30);
    holdingPeriod = m > 0 ? `${y}y ${m}m` : `${y} year${y !== 1 ? 's' : ''}`;
  }

  return {
    ...stock,
    investedValue: parseFloat(investedValue.toFixed(2)),
    currentValue: parseFloat(currentValue.toFixed(2)),
    pnl: parseFloat(pnl.toFixed(2)),
    pnlPercent: parseFloat(pnlPercent.toFixed(2)),
    holdingPeriod,
    recommendation: getRecommendation(stock.buyPrice, stock.currentPrice)
  };
};

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/api/stocks', (req, res) => {
  try { res.json(readStocks().map(enrichStock)); }
  catch { res.status(500).json({ error: 'Failed to read stocks' }); }
});

app.post('/api/stocks', (req, res) => {
  try {
    const stocks = readStocks();
    if (stocks.length >= 30) return res.status(400).json({ error: 'Maximum 30 stocks allowed' });
    const { name, code, buyDate, quantity, buyPrice, currentPrice } = req.body;
    if (!name || !code || !buyDate || !quantity || !buyPrice || !currentPrice)
      return res.status(400).json({ error: 'All fields are required' });
    const newStock = {
      id: uuidv4(),
      name: name.trim(),
      code: code.trim().toUpperCase(),
      buyDate,
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice),
      currentPrice: parseFloat(currentPrice),
      createdAt: new Date().toISOString()
    };
    stocks.push(newStock);
    writeStocks(stocks);
    res.status(201).json(enrichStock(newStock));
  } catch { res.status(500).json({ error: 'Failed to add stock' }); }
});

app.put('/api/stocks/:id', (req, res) => {
  try {
    const stocks = readStocks();
    const idx = stocks.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Stock not found' });
    const { name, code, buyDate, quantity, buyPrice, currentPrice } = req.body;
    stocks[idx] = {
      ...stocks[idx],
      name: name?.trim() ?? stocks[idx].name,
      code: (code?.trim() ?? stocks[idx].code).toUpperCase(),
      buyDate: buyDate ?? stocks[idx].buyDate,
      quantity: quantity !== undefined ? parseFloat(quantity) : stocks[idx].quantity,
      buyPrice: buyPrice !== undefined ? parseFloat(buyPrice) : stocks[idx].buyPrice,
      currentPrice: currentPrice !== undefined ? parseFloat(currentPrice) : stocks[idx].currentPrice,
      updatedAt: new Date().toISOString()
    };
    writeStocks(stocks);
    res.json(enrichStock(stocks[idx]));
  } catch { res.status(500).json({ error: 'Failed to update stock' }); }
});

app.delete('/api/stocks/:id', (req, res) => {
  try {
    const stocks = readStocks();
    const idx = stocks.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Stock not found' });
    stocks.splice(idx, 1);
    writeStocks(stocks);
    res.json({ message: 'Stock deleted successfully' });
  } catch { res.status(500).json({ error: 'Failed to delete stock' }); }
});

app.get('/api/settings', (req, res) => {
  try { res.json(readSettings()); }
  catch { res.status(500).json({ error: 'Failed to read settings' }); }
});

app.put('/api/settings', (req, res) => {
  try {
    const current = readSettings();
    const { theme, description } = req.body;
    const updated = {
      ...current,
      theme: theme !== undefined ? theme : current.theme,
      description: description !== undefined ? description : current.description
    };
    writeSettings(updated);
    res.json(updated);
  } catch { res.status(500).json({ error: 'Failed to update settings' }); }
});

app.get('/api/portfolio', (req, res) => {
  try {
    const stocks = readStocks().map(enrichStock);
    const settings = readSettings();
    const totalInvested = stocks.reduce((s, x) => s + x.investedValue, 0);
    const totalCurrent = stocks.reduce((s, x) => s + x.currentValue, 0);
    const totalPnl = totalCurrent - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
    res.json({
      stockCount: stocks.length,
      theme: settings.theme,
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      totalCurrent: parseFloat(totalCurrent.toFixed(2)),
      totalPnl: parseFloat(totalPnl.toFixed(2)),
      totalPnlPercent: parseFloat(totalPnlPercent.toFixed(2))
    });
  } catch { res.status(500).json({ error: 'Failed to get portfolio summary' }); }
});

app.listen(PORT, () =>
  console.log(`DP Portfolio Tracker API → http://localhost:${PORT}`)
);
