'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/hooks/use-auth';
import { APIProvider } from '@vis.gl/react-google-maps';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={['places']}>
            {children}
        </APIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
