import './globals.css';
import { Manrope } from 'next/font/google';
import type { Metadata } from 'next';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'Aza8 Hub',
  description: 'Multi-tenant hub'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
