import { Icons } from "@/app/components/icons";

export function Preloader() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <Icons.hospital className="h-16 w-16 animate-pulse text-primary" />
      <p className="mt-4 text-lg font-semibold text-muted-foreground">
        Loading Medical Facilities...
      </p>
    </div>
  );
}
