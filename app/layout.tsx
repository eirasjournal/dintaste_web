import type { Metadata } from "next";
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

export const metadata: Metadata = {
  // 1. Titlul Site-ului
  title: {
    default: "Din Taste | Robotics Engineering",
    template: "%s | Din Taste" 
  },

  // 2. Descrierea (SEO - Ce apare pe Google)
  // Am schimbat-o să reflecte statutul tău de student la master și focusul tehnic
  description: "A digital lab notebook by a Robotics Master's student. Bridging abstract theory and physical motion through simulation, kinematics, and control algorithms.",

  // 3. Cuvinte cheie (SEO)
  // Am adăugat termeni tehnici relevanți pentru portofoliul tău
  keywords: [
    "robotics", 
    "engineering", 
    "master student", 
    "kinematics", 
    "industrial automation", 
    "simulation", 
    "three.js", 
    "palletizing algorithms", 
    "Next.js portfolio", 
    "romania"
  ],

  // 4. Autor
  authors: [{ name: "Din Taste" }],

  // 5. Open Graph (Share pe LinkedIn/WhatsApp/Facebook)
  openGraph: {
    title: "Din Taste | Robotics & Simulation",
    description: "Documentation of an engineering journey. From lines of code to mechanical motion.",
    url: "https://dintaste.me", 
    siteName: "Din Taste Lab",
    images: [
      {
        url: "/catpixeled.png", // ATENȚIE: În codul anterior foloseai 'catpixeled.png', aici era 'pixelcat.png'. Am pus varianta din Navbar.
        width: 1200,
        height: 630,
        alt: "Din Taste Robotics Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // 6. Twitter Card (Share pe X)
  twitter: {
    card: "summary_large_image",
    title: "Din Taste | Robotics Engineering",
    description: "Exploring the math behind motion. A Robotics Master's digital notebook.",
    images: ["/catpixeled.png"],
  },

  // 7. Iconița din tab (Favicon)
  icons: {
    icon: "/catpixeled.png",
    shortcut: "/catpixeled.png",
    apple: "/catpixeled.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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