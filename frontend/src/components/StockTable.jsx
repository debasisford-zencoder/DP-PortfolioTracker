const REC = {
  'Buy More': 'bg-green-500/10 text-green-400 border border-green-500/30',
  'Hold':     'bg-blue-500/10  text-blue-400  border border-blue-500/30',
  'Sell':     'bg-red-500/10   text-red-400   border border-red-500/30'
}

const fmtUSD = (v) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtPct = (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`

export default function StockTable({ stocks, onAdd, onEdit, onDelete, onRefresh }) {
  return (
    <div className="bg-[#0d1526] border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-white">Stock Holdings</h2>
          <p className="text-xs text-slate-500 mt-0.5">{stocks.length} of 30 positions tracked</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            title="Refresh"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={onAdd}
            disabled={stocks.length >= 30}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Stock
          </button>
        </div>
      </div>

      {stocks.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">No stocks yet</p>
          <p className="text-slate-600 text-sm mt-1">Click “Add Stock” to start tracking</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {['Stock', 'Code', 'Holding Period', '# Stocks', 'Buy Price', 'Current Price', 'P & L', 'Recommendation', ''].map((h, i) => (
                  <th key={i} className={`px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider ${i >= 2 && i <= 6 ? 'text-right' : i === 7 ? 'text-center' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {stocks.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-white">{s.name}</p>
                    <p className="text-xs text-slate-500">
                      Since {new Date(s.buyDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono font-bold text-blue-300">{s.code}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm text-slate-300">{s.holdingPeriod}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-white font-medium">{s.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-slate-300">{fmtUSD(s.buyPrice)}</td>
                  <td className="px-4 py-3.5 text-right text-sm font-medium text-white">{fmtUSD(s.currentPrice)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <p className={`text-sm font-semibold ${s.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {s.pnl >= 0 ? '+' : ''}{fmtUSD(s.pnl)}
                    </p>
                    <p className={`text-xs ${s.pnlPercent >= 0 ? 'text-green-500/80' : 'text-red-500/80'}`}>
                      {fmtPct(s.pnlPercent)}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${REC[s.recommendation]}`}>
                      {s.recommendation}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(s)} title="Edit" className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => onDelete(s.id)} title="Delete" className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
