import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  fullName: string;
  role: string;
  facility?: string;
}

export default function Layout({ children, fullName, role, facility }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* top */}
      <Navbar fullName={fullName} role={role} facility={facility} />

      {/* page content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>

      {/* bottom */}
      <Footer />

    </div>
  );
}