import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Icons } from './icons';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.hospital className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold">MediFind</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="destructive">
            <Icons.phone className="mr-2 h-4 w-4" />
            Emergency Hotline
          </Button>
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
