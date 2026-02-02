import Image from "next/image";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-screen flex">
        <div className="w-1/2 flex items-center justify-center p-8">
          {children}
        </div>

        {/* Right Side - Illustration */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="relative w-full h-full max-w-2xl max-h-150">
            <Image
              src="/jewelry_login_illustration_shiny.svg"
              alt="brand image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </body>
    </html>
  );
}
