import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
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
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 font-bold tracking-widest mb-10 border-b border-gray-200 pb-6">LAST UPDATED: FEBRUARY 2026 • INTERNETSKILL.IN</p>

        <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p>Welcome to <strong>Internet Skill</strong>. These terms and conditions outline the rules and regulations for the use of our website, located at internetskill.in. By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Internet Skill if you do not agree to take all of the terms and conditions stated on this page.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property Rights</h2>
            <p>Unless otherwise stated, Internet Skill and/or its licensors own the intellectual property rights for all material on internetskill.in. All intellectual property rights are reserved. You may access this from Internet Skill for your own personal use subjected to restrictions set in these terms and conditions.</p>
            <p className="mt-4"><strong>You must not:</strong></p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Republish material from Internet Skill without proper credit.</li>
              <li>Sell, rent, or sub-license material from internetskill.in.</li>
              <li>Reproduce, duplicate, or copy content for commercial purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Comments & Community</h2>
            <p>Certain parts of this website offer the opportunity for users to post and exchange opinions and information. Internet Skill does not filter, edit, publish, or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Internet Skill, its agents, and/or affiliates.</p>
            <p className="mt-2">We reserve the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive, or causes a breach of these Terms and Conditions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Content Accuracy</h2>
            <p>We do our absolute best to ensure that the tech news, app reviews, and educational tutorials provided are accurate and up-to-date. However, the tech landscape changes rapidly. We do not warrant that the information on this website is complete, true, accurate, or non-misleading. Use the information at your own discretion.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Changes to These Terms</h2>
            <p>We reserve the right to revise these terms and conditions at any time as we see fit. By using this website, you are expected to review these terms on a regular basis to ensure you understand all terms and conditions governing the use of this website.</p>
          </section>

        </div>
      </main>
    </div>
  );
}