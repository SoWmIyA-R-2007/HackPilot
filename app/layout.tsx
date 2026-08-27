import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mission Control — Hackathon Automation Tracker',
  description:
    'Neo-Brutalist Bauhaus hackathon command center featuring mission dashboard, detailed event management, task tracking, email dispatches, and real-time alerts.',
  keywords: ['hackathon', 'tracker', 'automation', 'mission control', 'project management'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f5f0e8] text-[#1a1a1a] font-['Inter',sans-serif] antialiased selection:bg-[#ffcc00] selection:text-[#1a1a1a]">
        {children}
      </body>
    </html>
  );
}
