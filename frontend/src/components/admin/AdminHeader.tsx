'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, FileText, DollarSign, ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';
import { getAuthUser } from '@/lib/authSession';

interface AdminHeaderProps {
  onLogout?: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  const pathname = usePathname();
  const user = getAuthUser();

  const navItems = [
    {
      label: 'Blog Management',
      href: '/admin/blog',
      icon: FileText,
      active: pathname.startsWith('/admin/blog'),
    },
    {
      label: 'Pricing Plans',
      href: '/admin/pricing',
      icon: DollarSign,
      active: pathname.startsWith('/admin/pricing'),
    },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-30 mb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Back Link */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group text-slate-300 hover:text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-sm">
              <Activity className="w-3.5 h-3.5 text-slate-950 font-bold" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              Flow<span className="text-blue-400">metrics</span>
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 ml-1">
              Admin
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>View Site</span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#0F172A] p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  item.active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] truncate max-w-[160px]">
              {user?.email || 'admin@flowmetrics.dev'}
            </span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800/60 transition-colors text-xs cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
