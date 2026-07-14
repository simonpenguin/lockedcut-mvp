import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-slate-700 leading-relaxed">
          <p>
            Welcome to LockedCut. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our service.
          </p>
          
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. Video Hosting and Data</h2>
          <p>
            LockedCut acts as a gateway and timestamping service for videos hosted on third-party platforms (such as YouTube or Vimeo) or standard MP4 links you provide. We do not host, store, or claim ownership of the video files themselves. We only store the URLs and the timestamped notes created during the review process.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. Cookies and Tracking</h2>
          <p>
            We may use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. Merchant of Record</h2>
          <p>
            Our order process is conducted by our online reseller Lemon Squeezy. Lemon Squeezy is the Merchant of Record for all our orders. They process your payment and handle the related data in accordance with their own Privacy Policy. We do not directly store your credit card details on our servers.
          </p>
          
          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this notice, you may email us at support@lockedcut.com.
          </p>
        </div>
      </div>
    </div>
  );
}
