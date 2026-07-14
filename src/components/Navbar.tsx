'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Video } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="border-b border-slate-200 sticky top-0 z-50 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="LockedCut Logo" className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight text-slate-900">LockedCut<span className="text-indigo-600">.</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
          <a href="mailto:lockedcut@atomicmail.io" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Contact</a>
          
          {!loading && (
            user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</Link>
                <Link href="/dashboard/account" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Account</Link>
                <button 
                  onClick={handleSignOut}
                  className="text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition-colors px-4 py-2 rounded-full shadow-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
                <Link 
                  href="/login?mode=signup"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-full shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </nav>
        {/* Mobile nav fallback */}
        <div className="md:hidden flex items-center">
          {!loading && (
            user ? (
              <Link 
                href="/dashboard"
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-full shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/login?mode=signup"
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-full shadow-sm"
              >
                Sign Up
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
