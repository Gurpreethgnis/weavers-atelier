import type { Metadata } from "next";
import { Bodoni_Moda, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const defaultOgImage = "/images/hero/home-hero-landscape.jpg";

export const metadata: Metadata = {
  title: {
    default: "Custom Menswear, Made for You | Weaver's Atelier",
    template: "%s | Weaver's Atelier",
  },
  description:
    "Tailored shirts, trousers, denim, weddingwear, and statement pieces — made around your fit, your style, and your occasion.",
  keywords: [
    "custom menswear",
    "custom shirts",
    "tailored trousers",
    "custom denim",
    "embroidered jeans",
    "weddingwear for men",
    "groom outfits",
    "statement menswear",
    "made-to-measure",
  ],
  authors: [{ name: "Weaver's Atelier" }],
  creator: "Weaver's Atelier",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://weavers.studio"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Weaver's Atelier",
    title: "Custom Menswear, Made for You | Weaver's Atelier",
    description:
      "Tailored shirts, trousers, denim, weddingwear, and statement pieces — made around your fit, your style, and your occasion.",
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Menswear, Made for You | Weaver's Atelier",
    description:
      "Tailored shirts, trousers, denim, weddingwear, and statement pieces — made around your fit, your style, and your occasion.",
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${spaceGrotesk.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('weavers-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else if (theme === 'system') {
                    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                      document.documentElement.classList.add('light');
                    } else {
                      document.documentElement.classList.add('dark');
                    }
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
