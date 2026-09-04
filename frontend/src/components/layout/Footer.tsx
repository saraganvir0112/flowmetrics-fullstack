import Link from 'next/link';
import { Activity } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Workload Intelligence', href: '#features' },
        { label: 'Project Insights', href: '#features' },
        { label: 'Analytics Showcase', href: '#analytics' },
        { label: 'Dynamic Pricing', href: '#pricing' },
        { label: 'Release Notes', href: '#blog' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Distributed Engineering', href: '#features' },
        { label: 'Sprint Velocity Tracking', href: '#analytics' },
        { label: 'Asynchronous Workflow', href: '#features' },
        { label: 'Burnout Prevention', href: '#features' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Engineering Blog', href: '#blog' },
        { label: 'Product Telemetry Guide', href: '#blog' },
        { label: 'API Reference', href: '/api/health' },
        { label: 'Admin Portal', href: '/admin' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Flowmetrics', href: '#features' },
        { label: 'Security & Compliance', href: '#features' },
        { label: 'Privacy Policy', href: '#cta' },
        { label: 'Terms of Service', href: '#cta' },
      ],
    },
  ];

  return (
    <footer className="bg-[#05080F] border-t border-[#1A2438] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand & Mission Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Activity className="w-4 h-4 text-slate-950 font-bold" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Flow<span className="text-blue-400">metrics</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-5">
              Team productivity intelligence and workload analytics built for high-velocity remote and hybrid engineering organizations.
            </p>

            {/* System Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1422] border border-[#1A2438] text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono">
                {section.title}
              </h3>
              <ul className="space-y-2.5 text-xs">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1A2438]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} Flowmetrics Inc. All rights reserved. Fictional product demo for full-stack engineering challenge.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Flowmetrics GitHub"
              className="p-1.5 rounded-md hover:bg-slate-800/50 hover:text-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Flowmetrics Twitter"
              className="p-1.5 rounded-md hover:bg-slate-800/50 hover:text-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Flowmetrics LinkedIn"
              className="p-1.5 rounded-md hover:bg-slate-800/50 hover:text-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
