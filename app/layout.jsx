import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yamnang — Creative Development Studio",
  description:
    "Yamnang is an independent design and development studio crafting brands, websites and digital products with motion and intent.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/y-mark.svg", type: "image/svg+xml" },
    ],
    apple: "/y-mark.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
