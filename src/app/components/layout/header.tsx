import Link from 'next/link';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { Icons } from '@/app/components/icons';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <>
      <div className="bg-destructive text-destructive-foreground py-2 px-4 text-center text-sm font-medium animate-pulse-emergency">
        <div className="container mx-auto flex items-center justify-center gap-2 sm:gap-4">
            <Icons.alertTriangle className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline"><span className="font-bold">EMERGENCY?</span> This is not a substitute for professional medical advice. Call your local emergency number.</span>
             <span className="sm:hidden font-bold">EMERGENCY? CALL 911</span>
             <Button asChild size="sm" variant="outline" className="bg-destructive border-destructive-foreground/50 text-destructive-foreground hover:bg-destructive-foreground hover:text-destructive shrink-0">
                <a href="tel:911">
                    <Icons.phone className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Call Now</span>
                </a>
             </Button>
        </div>
      </div>
      <header className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm shadow-sm sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.hospital className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">MediFind</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="destructive" className="hidden sm:flex">
                <a href="tel:911">
                  <Icons.phone className="mr-2 h-4 w-4" />
                  Emergency Hotline
                </a>
              </Button>
              <ThemeToggle />
            </div>
        </div>
      </header>
    </>
  );
}
