import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Simple Header */}
      <header className="border-b border-gray-200 py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-[#e91e63] hover:text-pink-700 flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">Privacy Policy</h1>
        <p className="text-sm text-gray-500 font-bold tracking-widest mb-10 border-b border-gray-200 pb-6">LAST UPDATED: FEBRUARY 2026 • INTERNETSKILL.IN</p>

        <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p>Welcome to <strong>Internet Skill</strong> (internetskill.in). Your privacy is critically important to us. This Privacy Policy outlines the types of personal information that is received and collected by our website and how it is used.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Log Files:</strong> Like many other Web sites, we make use of log files. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks.</li>
              <li><strong>Cookies and Web Beacons:</strong> We use cookies to store information about visitors' preferences, to record user-specific information on which pages the site visitor accesses or visits, and to personalize or customize our web page content based upon visitors' browser type.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Google AdSense & DoubleClick DART Cookie</h2>
            <p>Google, as a third-party vendor, uses cookies to serve ads on internetskill.in. Google's use of the DART cookie enables it to serve ads to our site's visitors based upon their visit to our site and other sites on the Internet.</p>
            <p className="mt-2">Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at the following URL: <a href="http://www.google.com/privacy_ads.html" className="text-blue-600 hover:underline">http://www.google.com/privacy_ads.html</a></p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Links</h2>
            <p>Our website may contain links to other websites. We have no control over the privacy practices or the content of any of our business partners, advertisers, sponsors, or other websites to which we provide links.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
            <p>If you require any more information or have any questions about our privacy policy, please feel free to contact us by visiting our <Link href="/contact" className="text-[#e91e63] font-bold hover:underline">Contact Page</Link> or through our official social media handles.</p>
          </section>

        </div>
      </main>
    </div>
  );
}