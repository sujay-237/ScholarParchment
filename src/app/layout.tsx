import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ScholarshipDataProvider } from '@/context/ScholarshipDataContext';

export const metadata: Metadata = {
  title: 'ScholarParchment | National Scholarship & DBT Disbursement Portal',
  description:
    'A unified, transparent, and tamper-evident national scholarship management and direct benefit transfer (DBT) platform connecting Students, Educational Institutions, and Central Ministries.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-on-surface antialiased flex flex-col font-body selection:bg-primary-container selection:text-on-primary-container">
        <AuthProvider>
          <NotificationProvider>
            <ScholarshipDataProvider>
              <div className="flex-1 flex flex-col">
                {children}
              </div>
            </ScholarshipDataProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

