import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phrasal Lab — Master Phrasal Verbs",
  description: "Learn 120 essential English phrasal verbs through CEFR lessons, speaking practice and interactive games.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
