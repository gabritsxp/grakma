import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
