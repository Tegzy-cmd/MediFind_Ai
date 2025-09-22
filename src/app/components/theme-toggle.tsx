"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative h-8 w-[4.5rem] rounded-full bg-secondary p-1">
      <div
        className={cn(
          "absolute top-1/2 h-6 w-8 -translate-y-1/2 rounded-full bg-background shadow-md transition-transform",
          theme === "dark" ? "translate-x-[2.125rem]" : "translate-x-[0.125rem]"
        )}
      />
      <div className="relative z-10 flex items-center justify-around">
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-6 w-6 rounded-full"
          onClick={() => setTheme("light")}
          aria-label="Switch to light mode"
        >
          <Sun className="h-4 w-4 text-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-6 w-6 rounded-full"
          onClick={() => setTheme("dark")}
          aria-label="Switch to dark mode"
        >
          <Moon className="h-4 w-4 text-foreground" />
        </Button>
      </div>
    </div>
  );
}
