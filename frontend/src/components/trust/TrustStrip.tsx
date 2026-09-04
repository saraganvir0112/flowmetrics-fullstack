import React from 'react';

const fictionalLogos = [
  {
    name: 'Northstar',
    symbol: (
      <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
    ),
  },
  {
    name: 'Vertex',
    symbol: (
      <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L21 19H3L12 3ZM12 8L6.5 17H17.5L12 8Z" />
      </svg>
    ),
  },
  {
    name: 'Arcflow',
    symbol: (
      <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12H16C16 9.79 14.21 8 12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16V20C7.58 20 4 16.42 4 12Z" />
      </svg>
    ),
  },
  {
    name: 'Luma',
    symbol: (
      <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Stackline',
    symbol: (
      <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="3" rx="1.5" />
        <rect x="4" y="10.5" width="16" height="3" rx="1.5" />
        <rect x="4" y="17" width="16" height="3" rx="1.5" />
      </svg>
    ),
  },
];

export function TrustStrip() {
  return (
    <section className="py-12 border-y border-[#1A2438]/60 bg-[#070B14]/60">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-500 mb-8">
          Designed for modern distributed teams (fictional illustrative organizations)
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-70">
          {fictionalLogos.map((org) => (
            <div
              key={org.name}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors select-none group"
            >
              <div className="group-hover:text-blue-400 transition-colors">{org.symbol}</div>
              <span className="text-base font-bold tracking-tight font-sans text-slate-300 group-hover:text-white transition-colors">
                {org.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
