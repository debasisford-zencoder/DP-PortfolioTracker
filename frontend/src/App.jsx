import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import DashboardStats from './components/DashboardStats'
import StockTable from './components/StockTable'
import StockModal from './components/StockModal'
import SettingsModal from './components/SettingsModal'

const API = '/api'

export default function App() {
  const [stocks, setStocks] = useState([])
  const [portfolio, setPortfolio] = useState(null)
  const [settings, setSettings] = useState({ theme: 'My Portfolio', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingStock, setEditingStock] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [sRes, pRes, cRes] = await Promise.all([
        fetch(`${API}/stocks`),
        fetch(`${API}/portfolio`),
        fetch(`${API}/settings`)
      ])
      if (!sRes.ok || !pRes.ok || !cRes.ok) throw new Error()
      const [s, p, c] = await Promise.all([sRes.json(), pRes.json(), cRes.json()])
      setStocks(s)
      setPortfolio(p)
      setSettings(c)
    } catch {
      setError('Cannot reach the backend. Start the server with: cd backend && npm start')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const addStock = async (data) => {
    const res = await fetch(`${API}/stocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
    await fetchData()
    setShowAddModal(false)
  }

  const updateStock = async (id, data) => {
    const res = await fetch(`${API}/stocks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
    await fetchData()
    setEditingStock(null)
  }

  const deleteStock = async (id) => {
    if (!window.confirm('Remove this stock from your portfolio?')) return
    await fetch(`${API}/stocks/${id}`, { method: 'DELETE' })
    await fetchData()
  }

  const saveSettings = async (data) => {
    const res = await fetch(`${API}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to save settings')
    await fetchData()
    setShowSettings(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading portfolio…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      <Header theme={settings.theme} onSettings={() => setShowSettings(true)} />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/40 rounded-xl text-red-400 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <DashboardStats portfolio={portfolio} stocks={stocks} />

        <div className="mt-8">
          <StockTable
            stocks={stocks}
            onAdd={() => setShowAddModal(true)}
            onEdit={setEditingStock}
            onDelete={deleteStock}
            onRefresh={fetchData}
          />
        </div>
      </main>

      {(showAddModal || editingStock) && (
        <StockModal
          stock={editingStock}
          onSave={editingStock ? (d) => updateStock(editingStock.id, d) : addStock}
          onClose={() => { setShowAddModal(false); setEditingStock(null) }}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
