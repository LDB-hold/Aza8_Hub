import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aza8 Portal',
  description: 'Tenant-specific workspace'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">{children}</body>
    </html>
  );
}
