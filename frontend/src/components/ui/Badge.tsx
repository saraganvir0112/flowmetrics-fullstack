import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'blue' | 'teal' | 'amber' | 'emerald' | 'outline' | 'pulse';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    default: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    blue: 'bg-blue-950/60 text-blue-300 border border-blue-800/50 shadow-sm shadow-blue-900/20',
    teal: 'bg-teal-950/60 text-teal-300 border border-teal-800/50 shadow-sm shadow-teal-900/20',
    amber: 'bg-amber-950/60 text-amber-300 border border-amber-800/50',
    emerald: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
    pulse: 'bg-blue-950/60 text-blue-300 border border-blue-800/40 relative',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full tracking-wide transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {variant === 'pulse' && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
        </span>
      )}
      {children}
    </span>
  );
}
