import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Flowmetrics | Team Productivity & Analytics SaaS',
  description:
    'Fictional team productivity and analytics SaaS platform for remote and hybrid teams. Measure workload velocity, project health, and workflow balance.',
  keywords: [
    'team productivity',
    'analytics',
    'workload analytics',
    'remote teams',
    'time tracking',
    'flowmetrics',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
        {children}
      </body>
    </html>
  );
}
