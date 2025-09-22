import { Icons } from '../icons';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-6">
      <div className="container mx-auto px-4 text-center text-base">
        <p className="flex items-center justify-center gap-2 mb-2">
            <Icons.copyright className="h-4 w-4" />
            2025 MediFind - Emergency Medical Facility Finder
        </p>
        <p className="text-sm text-muted-foreground">This service is for locating medical facilities. Always call 911 for immediate emergencies.</p>
      </div>
    </footer>
  );
}
