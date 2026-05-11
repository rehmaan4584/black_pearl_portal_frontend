import { AuthBrandingPanel } from "@/components/AuthBrandingPanel";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh flex flex-col bg-background lg:flex-row">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <AuthBrandingPanel />
    </div>
  );
}
