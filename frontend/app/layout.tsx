import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { NotificationProvider } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import GlassBackground from '../components/GlassBackground';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'MealShare — Cook smarter. Share better.',
  description: 'Track ingredients, recipe hub, weekly planner, and sustainability score.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f6f4ee] dark:bg-[#0b1324] text-[#0C1322] dark:text-slate-100 min-h-screen antialiased flex transition-colors duration-200 font-sans relative">
        <GlassBackground />
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden relative z-10 pt-14 lg:pt-0">
                <TopHeader />
                <main className="flex-1 p-6 sm:p-10 bg-transparent transition-colors duration-200">
                  {children}
                </main>
              </div>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
