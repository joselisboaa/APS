import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mapeamento de Acessibilidade",
  description: "Aplicação para mapear a acessibilidade de instituições.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full w-full" lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
