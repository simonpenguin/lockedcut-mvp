import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-slate-700 leading-relaxed">
          <p>
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and LockedCut ("we," "us" or "our"), concerning your access to and use of the LockedCut website and service.
          </p>
          
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing the Service, you agree that you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Service.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. Service Description</h2>
          <p>
            LockedCut provides a video review workflow tool intended to enforce revision limits. We do not host your video content; we rely on third-party URLs (e.g., YouTube, Vimeo) that you provide. You are entirely responsible for the content and licensing of the videos you link to our Service.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. Payments and Subscriptions</h2>
          <p>
            We use Gumroad as our Merchant of Record. By subscribing to a paid tier, you agree to their terms of sale. Subscriptions are billed on a recurring basis as selected during checkout. You may cancel your subscription at any time.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. Prohibited Activities</h2>
          <p>
            You may not access or use the Service for any purpose other than that for which we make the Service available. The Service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>
          
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Disclaimer</h2>
          <p>
            The Service is provided on an AS-IS and AS-AVAILABLE basis. You agree that your use of the Service will be at your sole risk.
          </p>
        </div>
      </div>
    </div>
  );
}
