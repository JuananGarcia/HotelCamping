import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nordic Stays | Glamping Premium',
  description: 'Desconecta en la naturaleza con la comodidad del mañana.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-zinc-50 text-zinc-900 antialiased`}>
        <Navbar />
        <main className="pt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
