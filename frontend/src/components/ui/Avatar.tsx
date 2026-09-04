import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  // Generate deterministic gradient based on name hash
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-teal-400 to-emerald-600',
    'from-cyan-500 to-blue-600',
    'from-indigo-500 to-purple-600',
    'from-teal-500 to-cyan-600',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradient = gradients[Math.abs(hash) % gradients.length];

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-slate-950 shadow-md select-none shrink-0 ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
