import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trios Admin',
  description: 'Admin dashboard for Trios',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}