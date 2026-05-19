import { useState } from 'react'

const TODAY = new Date().toISOString().split('T')[0]

const derive = (buy, current) => {
  if (!buy || !current || isNaN(buy) || isNaN(current) || buy <= 0) return null
  const pct = ((current - buy) / buy) * 100
  return { pct, rec: pct < -10 ? 'Buy More' : pct > 20 ? 'Sell' : 'Hold', gain: pct >= 0 }
}

export default function StockModal({ stock, onSave, onClose }) {
  const [form, setForm] = useState({
    name: stock?.name || '',
    code: stock?.code || '',
    buyDate: stock?.buyDate || TODAY,
    quantity: stock?.quantity ?? '',
    buyPrice: stock?.buyPrice ?? '',
    currentPrice: stock?.currentPrice ?? ''
  })
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const preview = derive(parseFloat(form.buyPrice), parseFloat(form.currentPrice))

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    const { name, code, buyDate, quantity, buyPrice, currentPrice } = form
    if (!name || !code || !buyDate || !quantity || !buyPrice || !currentPrice)
      return setErr('All fields are required')
    setSaving(true)
    try { await onSave(form) }
    catch (ex) { setErr(ex.message) }
    finally { setSaving(false) }
  }

  const inputCls = 'w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors'

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1526] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white">{stock ? 'Edit Stock' : 'Add New Stock'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {err && <div className="p-3 bg-red-900/20 border border-red-700/40 rounded-lg text-red-400 text-sm">{err}</div>}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Stock Name</label>
            <input type="text" value={form.name} onChange={set('name')} placeholder="e.g. Apple Inc." className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Stock Code</label>
              <input type="text" value={form.code} onChange={set('code')} placeholder="e.g. AAPL" className={`${inputCls} uppercase`} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Buy Date</label>
              <input type="date" value={form.buyDate} max={TODAY} onChange={set('buyDate')} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5"># Stocks</label>
              <input type="number" value={form.quantity} onChange={set('quantity')} placeholder="0" min="0.001" step="any" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Buy Price ($)</label>
              <input type="number" value={form.buyPrice} onChange={set('buyPrice')} placeholder="0.00" min="0.01" step="any" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Current Price ($)</label>
              <input type="number" value={form.currentPrice} onChange={set('currentPrice')} placeholder="0.00" min="0.01" step="any" className={inputCls} />
            </div>
          </div>

          {preview && (
            <div className={`p-3 rounded-lg ${preview.gain ? 'bg-green-900/20 border border-green-800/30' : 'bg-red-900/20 border border-red-800/30'}`}>
              <p className="text-xs text-slate-500 mb-0.5">Preview</p>
              <p className={`text-sm font-semibold ${preview.gain ? 'text-green-400' : 'text-red-400'}`}>
                {preview.gain ? '+' : ''}{preview.pct.toFixed(2)}% · Recommendation: <span className="font-bold">{preview.rec}</span>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
              {saving ? 'Saving…' : stock ? 'Update Stock' : 'Add Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
