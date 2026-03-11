import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Send, Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-800 font-sans pb-12">
      <header className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-[#e91e63] hover:text-pink-700 flex items-center gap-2 font-bold text-sm uppercase tracking-wider">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">Contact Us</h1>
          <p className="text-gray-500 font-medium">Have a question, feedback, or business inquiry? We'd love to hear from you!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Left: Contact Info */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-[#e91e63]">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Email Us</p>
                  <p className="text-lg font-medium text-gray-900">internetskillcontact@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Location</p>
                  <p className="text-lg font-medium text-gray-900">Ranchi, Jharkhand, India</p>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 border-t border-gray-100 pt-6">Follow Us on Social Media</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/internet_skill_?igsh=OXFyMDczYWhqNmE2" target="_blank" className="bg-gray-50 p-3 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"><Instagram size={24} /></a>
              <a href="https://www.facebook.com/share/14RfVdeqBj6/" target="_blank" className="bg-gray-50 p-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Facebook size={24} /></a>
              <a href="https://www.youtube.com/@Internet_Skill" target="_blank" className="bg-gray-50 p-3 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"><Youtube size={24} /></a>
              <a href="https://t.me/Internetskil" target="_blank" className="bg-gray-50 p-3 rounded-lg text-gray-600 hover:text-blue-400 hover:bg-blue-50 transition-colors"><Send size={24} /></a>
              <a href="https://whatsapp.com/channel/0029Va5E7bAI7BeKuXSTqe1X" target="_blank" className="bg-gray-50 p-3 rounded-lg text-gray-600 hover:text-green-500 hover:bg-green-50 transition-colors"><MessageCircle size={24} /></a>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea rows={4} placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] outline-none transition-all resize-none"></textarea>
              </div>
              <button type="button" className="w-full bg-[#e91e63] hover:bg-pink-700 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg shadow-pink-200">
                Submit Message
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}