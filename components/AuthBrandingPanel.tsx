import { cn } from "@/lib/utils";
import { BlackPearlLogo } from "./BlackPearlLogo";


export function AuthBrandingPanel() {
  return (
    <div className="hidden min-h-svh flex-1 flex-col overflow-hidden bg-[#01454D] lg:flex">
      <div className="relative flex flex-1 flex-col px-12 py-16 xl:px-16">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 0%, #20D6E3 0%, transparent 40%),
              radial-gradient(circle at 80% 100%, #0E7C86 0%, transparent 45%)`,
          }}
        />

        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <div className="mb-10">
            <BlackPearlLogo size="lg" />
          </div>

          <blockquote className="max-w-md space-y-4">
            <p className="text-2xl font-semibold leading-snug tracking-tight text-foreground xl:text-3xl">
              Manage catalog, variants, and imagery from one place.
            </p>
            <p className="text-sm leading-relaxed text-secondary">
              Built for teams who care about consistency across products,
              categories, and storefront experience.
            </p>
          </blockquote>
        </div>

        <p className="relative z-10 mt-auto pb-10 text-xs text-muted-foreground">
          Black Pearl merchant portal
        </p>
      </div>
    </div>
  );
}

