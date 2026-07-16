'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Video, Home, LayoutDashboard, User, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="LockedCut Logo" className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight text-slate-900">LockedCut<span className="text-indigo-600">.</span></span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              <Home size={16} /> <span className="hidden sm:inline">Home</span>
            </Link>
            <Link href="/dashboard/account" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              <User size={16} /> <span className="hidden sm:inline">Account</span>
            </Link>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors ml-2"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
