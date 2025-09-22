import { Header } from '@/app/components/header';
import { Footer } from '@/app/components/footer';
import { EmergencyBanner } from '@/app/components/emergency-banner';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <EmergencyBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
