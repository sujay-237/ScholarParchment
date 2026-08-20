'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect unauthenticated guests accessing protected routes to /auth
  useEffect(() => {
    const isProtectedRoute =
      pathname.startsWith('/student/dashboard') ||
      pathname.startsWith('/student/applications') ||
      pathname.startsWith('/student/profile') ||
      pathname.startsWith('/student/payments') ||
      pathname.startsWith('/student/apply') ||
      pathname.startsWith('/college') ||
      pathname.startsWith('/ministry') ||
      pathname.startsWith('/notifications');

    if (!isAuthenticated && isProtectedRoute) {
      router.push('/auth');
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
