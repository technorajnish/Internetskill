import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <header className="border-b border-gray-200 py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-[#e91e63] hover:text-pink-700 flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">Disclaimer</h1>
        <p className="text-sm text-gray-500 font-bold tracking-widest mb-10 border-b border-gray-200 pb-6">LAST UPDATED: FEBRUARY 2026 • INTERNETSKILL.IN</p>

        <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
          
          <section>
            <p>Welcome to <strong>Internet Skill</strong>. Before you dive into our articles, apps, and tutorials, we want to be completely transparent with you about how we operate and what you can expect from our content.</p>
            <p className="mt-4">The information provided on <strong>internetskill.in</strong> is for general informational and educational purposes only. While we work hard to keep the information up-to-date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website for any purpose.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. "Earn Money" & Financial Disclaimer</h2>
            <p>We share various methods, apps, and ideas on how to earn money online. However, we are not financial advisors. Your earning potential depends entirely on your own effort, skills, and market conditions. Any income or earnings statements are estimates of income potential only, and there is no assurance that your earnings will match the figures we present. <strong>We are not responsible for any financial losses or damages</strong> resulting from the use of strategies or apps mentioned on our site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. "Hacking" & Tech Education Disclaimer</h2>
            <p>Our "Hacking" and tech-related categories are strictly for <strong>Educational and Ethical purposes only</strong>. We aim to help users understand cybersecurity, protect their devices, and learn how systems work. We strongly condemn any illegal activities. If you use the knowledge gained from this website to perform malicious activities, compromise networks, or break the law, you do so entirely at your own risk. Internet Skill and its authors will not be held accountable for your actions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sarkari Yojana & Government Information</h2>
            <p>We regularly post updates about "Sarkari Yojana" and government jobs. Please note that <strong>we are not a government entity</strong>, nor are we affiliated with any government organization. We gather information from public domains, news outlets, and official notifications to help our readers. Always verify the information and apply only through the official government portals. We are not responsible for any errors or missed deadlines.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. External Links</h2>
            <p>Through this website, you are able to link to other websites which are not under the control of Internet Skill. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Consent</h2>
            <p>By using our website, you hereby consent to our disclaimer and agree to its terms. If you require any more information or have any questions about our site's disclaimer, please feel free to contact us.</p>
          </section>

        </div>
      </main>
    </div>
  );
}