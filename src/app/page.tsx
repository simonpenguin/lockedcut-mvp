import Link from 'next/link';
import { ArrowRight, Video, MessageSquare, Lock, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 sticky top-0 z-50 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Video className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">LockedCut<span className="text-indigo-600">.</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Contact</Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
            <Link 
              href="/dashboard"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-full shadow-sm"
            >
              Sign Up
            </Link>
          </nav>
          {/* Mobile nav fallback (just sign up) */}
          <div className="md:hidden flex items-center">
            <Link 
              href="/dashboard"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-full shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Stop Drip-Fed Feedback
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 max-w-4xl">
            End revision hell and take back your timeline.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
            The only video review tool built specifically to enforce your contract. Clients get one link, one round of feedback, and a hard lockout when they submit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/dashboard"
              className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Start Enforcing Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors border border-slate-200 shadow-sm">
              View Demo Project
            </button>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full max-w-6xl mx-auto px-6 py-24 border-t border-slate-200/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">How it works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">A seamless workflow that protects your time without frustrating your clients.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 border border-indigo-100">
                <Video className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">1. Create a Project</h3>
              <p className="text-slate-600 leading-relaxed">
                Paste a YouTube, Vimeo, or MP4 link. Set the exact number of revision rounds allowed by your contract.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 border border-indigo-100">
                <MessageSquare className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">2. Client Reviews</h3>
              <p className="text-slate-600 leading-relaxed">
                Clients draft timestamped notes on a beautiful, distraction-free interface. No accounts required for them.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-50 z-0 pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 border border-rose-100 relative z-10">
                <Lock className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 relative z-10">3. Hard Lockout</h3>
              <p className="text-slate-600 leading-relaxed relative z-10">
                Once they hit submit, the link locks. No more "just one more thing" emails the next day. The round is over.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full max-w-6xl mx-auto px-6 py-24 border-t border-slate-200/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Simple, transparent pricing</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Stop paying enterprise per-user fees just to get a timestamped note.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col shadow-sm">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-slate-900">Freelancer</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-slate-500">/ forever</span>
                </div>
                <p className="text-slate-600 mt-4">Perfect for solo editors who want to test the waters and protect small projects.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Up to 3 active projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Unlimited clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Standard timestamp support</span>
                </li>
              </ul>
              <Link 
                href="/dashboard"
                className="w-full py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-center transition-colors border border-slate-200 shadow-sm"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-white border-2 border-indigo-500 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-sm">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-[60px]" />
              
              <div className="mb-8 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-slate-900">Studio Pro</h3>
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                    Recommended
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$12</span>
                  <span className="text-slate-500">/ month</span>
                </div>
                <p className="text-slate-600 mt-4">For full-time editors managing multiple clients and strict timelines.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1 relative z-10">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Unlimited active projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Custom branding & logos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Export notes to Premiere Pro XML</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Priority email support</span>
                </li>
              </ul>
              <button className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-center transition-colors shadow-md relative z-10">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200/50 py-8 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} LockedCut. Stop scope creep.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
