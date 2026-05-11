function PearlMark({ className }: { className?: string }) {
  return (
    <div
      className={[
        "relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full",
        "border border-white/8 bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        "bg-[radial-gradient(circle_at_30%_20%,rgba(234,179,8,0.24),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(234,179,8,0.12),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0))]",
        className ?? "",
      ].join(" ")}
      aria-hidden
    >
      <div className="h-4 w-4 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(234,179,8,0.35),rgba(234,179,8,0.05)_60%)]" />
    </div>
  );
}

export function AuthBrandingPanel() {
  return (
    <div className="hidden min-h-svh flex-1 flex-col overflow-hidden bg-zinc-950 lg:flex">
      <div className="relative flex flex-1 flex-col px-12 py-16 xl:px-16">
        <div
          aria-hidden
          className="absolute inset-0 opacity-75"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 0%, rgba(234,179,8,0.10), transparent 40%),
              radial-gradient(circle at 80% 100%, rgba(234,179,8,0.06), transparent 45%)`,
          }}
        />

        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <div className="mb-10 flex items-center gap-3">
            <PearlMark />
            <div className="leading-none">
              <div className="text-sm font-semibold tracking-[0.22em] text-zinc-50">
                BLACK PEARL
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                merchant portal
              </div>
            </div>
          </div>

          <blockquote className="max-w-md space-y-4">
            <p className="text-2xl font-semibold leading-snug tracking-tight text-zinc-50 xl:text-3xl">
              Manage catalog, variants, and imagery from one place.
            </p>
            <p className="text-sm leading-relaxed text-zinc-400">
              Built for teams who care about consistency across products,
              categories, and storefront experience.
            </p>
          </blockquote>
        </div>

        <p className="relative z-10 mt-auto pb-10 text-xs text-zinc-500">
          Black Pearl merchant portal
        </p>
      </div>
    </div>
  );
}

