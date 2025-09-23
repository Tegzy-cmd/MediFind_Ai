'use client';

import { EmergencyBanner } from "@/app/components/emergency-banner";
import { Footer } from "@/app/components/layout/footer";
import { Header } from "@/app/components/layout/header";

export function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <EmergencyBanner />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
