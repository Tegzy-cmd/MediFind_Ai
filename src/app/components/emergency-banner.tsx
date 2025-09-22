import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icons } from './icons';

export function EmergencyBanner() {
  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-t-0 text-center">
      <div className="container flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
            <Icons.alertTriangle className="h-5 w-5" />
            <AlertTitle className="font-semibold">Medical Emergency?</AlertTitle>
        </div>
        <AlertDescription className="flex-grow">
          This tool is for informational purposes only. If you are experiencing a medical emergency, please call your local emergency number immediately.
        </AlertDescription>
        <a href="tel:911">
            <Button size="sm" className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90">
                <Icons.phone className="mr-2 h-4 w-4" /> Call Now
            </Button>
        </a>
      </div>
    </Alert>
  );
}
