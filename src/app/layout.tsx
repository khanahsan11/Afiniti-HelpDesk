import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "../components/auth/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Afiniti HelpDesk",
  description: "Customer support dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
