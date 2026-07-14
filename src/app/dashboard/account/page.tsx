'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, ShieldCheck } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', user.id)
          .single();
        
        setIsPro(profile?.is_pro ?? false);
      }
      setLoading(false);
    };

    fetchAccountDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-8 flex justify-center">
        <div className="text-slate-500">Loading account details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-8 flex justify-center">
        <div className="text-slate-500">Please sign in to view your account.</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-slate-900">
          <User className="text-indigo-600" /> My Account
        </h1>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Email Address</h3>
              <p className="text-lg text-slate-900 font-medium">{user.email}</p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Current Plan</h3>
              <div className="flex items-center gap-3">
                <ShieldCheck className={isPro ? "text-indigo-600 w-6 h-6" : "text-slate-400 w-6 h-6"} />
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  isPro 
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  Status: {isPro ? 'Studio Pro' : 'Freelancer'}
                </span>
              </div>
              
              {!isPro && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <h4 className="font-semibold text-indigo-900 mb-2">Upgrade to Studio Pro</h4>
                  <p className="text-sm text-indigo-700 mb-4">
                    Unlock unlimited projects and remove the free tier restrictions.
                  </p>
                  <a href="/#pricing" className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                    View Upgrade Options
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
