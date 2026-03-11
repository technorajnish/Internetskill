import Link from "next/link";
import { ArrowLeft, Target, ShieldCheck, Zap } from "lucide-react";

export default function AboutUs() {
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
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">About Us</h1>
        <p className="text-sm text-gray-500 font-bold tracking-widest mb-10 border-b border-gray-200 pb-6">KNOW THE STORY BEHIND INTERNET SKILL</p>

        <div className="space-y-8 text-gray-600 leading-relaxed text-lg">
          
          <section>
            <p className="text-xl font-medium text-gray-800 leading-snug">
              Welcome to <strong>Internet Skill</strong> (internetskill.in). Operating proudly from <strong>Ranchi, Jharkhand (India)</strong>, we are a passionate team dedicated to decoding the digital world for everyday users.
            </p>
            <p className="mt-4">
              The internet is a vast ocean of opportunities, but finding genuine information can be overwhelming. We started Internet Skill with a simple vision: to bridge the gap between complex technology and the common user. Whether you are a student looking for a 'Sarkari Yojana', a tech-enthusiast learning cybersecurity (Hacking), or someone trying to earn money online through genuine apps, we are here to guide you.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-6 py-8">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
              <Zap className="mx-auto text-[#e91e63] mb-4" size={40} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Updates</h3>
              <p className="text-sm">We provide the latest tech news, app reviews, and AI Prompts before they go mainstream.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
              <ShieldCheck className="mx-auto text-blue-500 mb-4" size={40} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% Genuine</h3>
              <p className="text-sm">From 'Earn Money' apps to Government Jobs, we verify the facts before publishing.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
              <Target className="mx-auto text-green-500 mb-4" size={40} />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-sm">To empower youth with digital skills and keep them safe in the online world.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Cover</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Tech News & Apps:</strong> Honest reviews and hidden features of smartphones and applications.</li>
              <li><strong>Earning & Growth:</strong> Tested methods to make money online and AI prompt engineering tricks.</li>
              <li><strong>Education & Security:</strong> Ethical hacking tutorials to protect your digital footprint.</li>
              <li><strong>Government Schemes:</strong> Fast and accurate updates on Sarkari Yojanas and Jobs.</li>
            </ul>
          </section>

          <section>
            <p className="mt-8 font-medium italic text-center text-gray-500">
              "We believe that the right internet skill can change your life. Thank you for being a part of our journey." <br/> <strong className="text-gray-900 not-italic mt-2 block">— Founder, Internet Skill</strong>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}