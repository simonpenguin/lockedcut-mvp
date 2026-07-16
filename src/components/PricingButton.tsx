'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function PricingButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <button className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-center transition-colors shadow-md relative z-10 opacity-50">
        Loading...
      </button>
    );
  }

  if (!user) {
    return (
      <button 
        onClick={() => router.push('/login')}
        className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-center transition-colors shadow-md relative z-10"
      >
        Sign in to Upgrade
      </button>
    );
  }

  return (
    <a 
      href={`https://zasiman.gumroad.com/l/rzguwx?email=${encodeURIComponent(user.email || '')}`}
      className="block w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-center transition-colors shadow-md relative z-10"
    >
      Upgrade to Pro
    </a>
  );
}
