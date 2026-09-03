import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Noblecare4u Lead Operations Dashboard',
  description: 'Private care enquiry and attribution management for Noblecare4u',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  other: {
    robots: 'noindex, nofollow, noarchive',
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
