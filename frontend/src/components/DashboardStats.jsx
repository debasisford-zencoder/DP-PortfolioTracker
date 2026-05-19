const fmt = (val) => {
  if (Math.abs(val) >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`
  if (Math.abs(val) >= 1_000) return `$${(val / 1_000).toFixed(1)}K`
  return `$${val.toFixed(2)}`
}

const StatCard = ({ title, children, icon }) => (
  <div className="bg-[#0d1526] border border-slate-800 rounded-2xl p-5">
    <div className="flex items-start justify-between gap-2">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
        {icon}
      </div>
    </div>
    <div className="mt-3">{children}</div>
  </div>
)

export default function DashboardStats({ portfolio, stocks }) {
  if (!portfolio) return null

  const gain = portfolio.totalPnl >= 0
  const buyMore = stocks.filter(s => s.recommendation === 'Buy More').length
  const hold = stocks.filter(s => s.recommendation === 'Hold').length
  const sell = stocks.filter(s => s.recommendation === 'Sell').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Stocks"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        >
          <p className="text-2xl font-bold text-white">{portfolio.stockCount}<span className="text-slate-600 text-base font-normal"> / 30</span></p>
          <p className="text-xs text-slate-500 mt-0.5">{30 - portfolio.stockCount} slots available</p>
        </StatCard>

        <StatCard
          title="Portfolio Theme"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
        >
          <p className="text-xl font-bold text-blue-400 truncate">{portfolio.theme}</p>
          <p className="text-xs text-slate-500 mt-0.5">Investment strategy</p>
        </StatCard>

        <StatCard
          title="Invested Value"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        >
          <p className="text-2xl font-bold text-white">{fmt(portfolio.totalInvested)}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total capital deployed</p>
        </StatCard>

        <StatCard
          title="Current Value"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        >
          <p className={`text-2xl font-bold ${gain ? 'text-green-400' : 'text-red-400'}`}>{fmt(portfolio.totalCurrent)}</p>
          <p className={`text-xs mt-0.5 font-medium ${gain ? 'text-green-500' : 'text-red-500'}`}>
            {gain ? '+' : ''}{fmt(portfolio.totalPnl)} ({gain ? '+' : ''}{portfolio.totalPnlPercent}%)
          </p>
        </StatCard>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500">Buy More</p>
            <p className="text-xl font-bold text-green-400">{buyMore}</p>
          </div>
        </div>
        <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500">Hold</p>
            <p className="text-xl font-bold text-blue-400">{hold}</p>
          </div>
        </div>
        <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500">Sell</p>
            <p className="text-xl font-bold text-red-400">{sell}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
