import { Inter } from 'next/font/google';
import './globals.css';
import CommonLayout from '@/components/CommonLayout';
import AuthProvider from '@/components/AuthProvider';
import { auth } from "../auth"

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LinkShorti - URL Shortener & Link Management',
  description: 'LinkShorti is a modern URL shortener that helps you create short links and earn money. Fast, reliable, and secure link shortening service.',
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <AuthProvider session={session}>
        <body className={`bg-background text-foreground ${inter.className}`}>
          <CommonLayout>
            {children}
          </CommonLayout>
        </body>
      </AuthProvider>
    </html>
  );
}
