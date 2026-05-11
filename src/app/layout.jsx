import "./globals.css";

export const metadata = {
  title: "EconID",
  description:
    "Financial identity infrastructure for informal traders, lenders, and micro-insurance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--color-canvas)] text-[var(--color-ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
