import type {ReactNode} from 'react';
import {appFont} from '@/lib/fonts';
import './globals.css';

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${appFont.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
