
'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { Icons } from '@/app/components/icons';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b bg-card/50 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Icons.hospital className="h-7 w-7 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">MediFind</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button asChild variant="destructive" size="sm" className="text-xs sm:text-sm">
              <a href="tel:911">
                <Icons.phone className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Emergency</span>
              </a>
            </Button>
            <ThemeToggle />
          </div>
      </div>
    </header>
  );
}
