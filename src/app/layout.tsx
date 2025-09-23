import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ClientProviders } from './components/client-providers';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'MediFind',
  description: 'Find the best medical facility for your needs.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('font-sans antialiased', poppins.variable)}
        suppressHydrationWarning
      >
        <ClientProviders>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
