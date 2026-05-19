import { useState } from 'react'

export default function SettingsModal({ settings, onSave, onClose }) {
  const [form, setForm] = useState({ theme: settings?.theme || '', description: settings?.description || '' })
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.theme.trim()) return setErr('Portfolio theme is required')
    setErr('')
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
          <h3 className="text-sm font-semibold text-white">Portfolio Settings</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {err && <div className="p-3 bg-red-900/20 border border-red-700/40 rounded-lg text-red-400 text-sm">{err}</div>}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Portfolio Theme</label>
            <input type="text" value={form.theme} onChange={set('theme')} placeholder="e.g. Technology Growth" className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={set('description')} placeholder="Describe your investment strategy…" rows={3} className={`${inputCls} resize-none`} />
          </div>

          <div className="p-3 bg-slate-800/60 rounded-lg">
            <p className="text-xs text-slate-500 leading-relaxed">
              Recommendation thresholds:
              <span className="text-green-400 font-medium"> Buy More</span> when P&amp;L &lt; −10% · 
              <span className="text-blue-400 font-medium">Hold</span> between −10% and +20% · 
              <span className="text-red-400 font-medium">Sell</span> when P&amp;L &gt; +20%
            </p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
