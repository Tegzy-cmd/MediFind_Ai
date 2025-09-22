export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} MediFind - Emergency Medical Facility Finder.
        </p>
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          This service is for locating medical facilities. Always call 911 for immediate emergencies.
        </p>
      </div>
    </footer>
  );
}
