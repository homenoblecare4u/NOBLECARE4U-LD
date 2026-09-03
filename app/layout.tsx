import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Noblecare4u Lead Operations Dashboard',
  description: 'Private, secure care enquiry and attribution management for Noblecare4u administrators',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dashboard-body">
        {children}
      </body>
    </html>
  );
}
