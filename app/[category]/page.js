import Link from "next/link";
import mongoose from "mongoose";
import Post from "@/models/Post"; // MongoDB का मॉडल
import { Search, Menu, Home, LayoutGrid, IndianRupee, Cpu, BookOpen, TerminalSquare, Sparkles, Landmark, Smartphone, BookType, Briefcase, ChevronDown, Instagram, Facebook, Youtube, Send, MessageCircle } from "lucide-react";

// 🛠️ MongoDB कनेक्शन फंक्शन
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  
  // लिंक से कैटेगरी का नाम निकालना
  const categorySlug = resolvedParams.category; 
  // 'earn-money' को 'Earn Money' बनाना
  const formattedCategory = categorySlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  // 🚀 MongoDB से कनेक्ट करना
  await connectDB();
  
  // 🚀 सिर्फ उसी कैटेगरी की पोस्ट्स MongoDB से ढूँढना (Case Insensitive)
  const rawPosts = await Post.find({ 
    category: { $regex: new RegExp(`^${formattedCategory}$`, "i") } 
  })
  .sort({ isPinned: -1, createdAt: -1 })
  .lean(); // .lean() से डेटा फ़ास्ट आता है
  
  // Frontend के लिए डेटा को सही फॉर्मेट में करना
  const posts = rawPosts.map(p => ({
    ...p,
    _id: p._id.toString(), // ID को स्ट्रिंग बनाना ज़रूरी है
    createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString()
  }));

  // 🚀 NEW MASTER CATEGORIES UPDATED HERE!
  const categories = [
    { name: "Home", link: "/", icon: <Home size={18} className="text-blue-500" /> }, 
    { name: "Apps & Website", link: "/apps-and-website", icon: <LayoutGrid size={18} className="text-purple-500" /> }, 
    { name: "Earn Money", link: "/earn-money", icon: <IndianRupee size={18} className="text-emerald-500" /> },
    { name: "Tech News", link: "/tech-news", icon: <Cpu size={18} className="text-indigo-500" /> }, 
    { name: "Ethical Hacking", link: "/ethical-hacking", icon: <TerminalSquare size={18} className="text-red-500" /> },
    { name: "AI Prompt", link: "/ai-prompt", icon: <Sparkles size={18} className="text-pink-500" /> }, 
    { name: "Sarkari Yojana", link: "/sarkari-yojana", icon: <Landmark size={18} className="text-orange-500" /> }
  ];

  const visibleCategories = categories.slice(0, 8);
  const hiddenCategories = categories.slice(8);

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-900 font-sans flex flex-col selection:bg-[#e91e63] selection:text-white">
      
      {/* 🚀 1. EXACT HOMEPAGE HEADER */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm relative">
        <div className="max-w-[1500px] mx-auto px-4 py-3 flex justify-between items-center gap-6">
          
          <div className="flex items-center gap-3 shrink-0">
            {/* 📱 Mobile Menu */}
            <details className="group lg:hidden relative">
              <summary className="list-none cursor-pointer p-1">
                <Menu className="text-gray-800 hover:text-[#e91e63] transition-colors" size={28} />
              </summary>
              <div className="absolute top-[45px] left-0 w-[260px] max-h-[80vh] overflow-y-auto bg-white shadow-2xl border border-gray-100 rounded-xl p-3 z-[100] flex flex-col gap-1">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2 ml-2 mt-1">Explore Categories</h3>
                 {categories.map((cat, i) => (
                   <Link key={i} href={cat.link} className="flex items-center gap-4 py-3 px-3 hover:bg-pink-50 rounded-lg transition-colors group/item">
                     <span className="group-hover/item:scale-110 transition-transform">{cat.icon}</span>
                     <span className="text-[14px] font-bold text-gray-700 group-hover/item:text-[#e91e63] transition-colors">{cat.name}</span>
                   </Link>
                 ))}
              </div>
            </details>

            <Link href="/" className="flex items-center gap-2">
              <img src="https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/20250611_004115_20250611_131539-imagetourl.cloud-1770749760299-z8zjkk.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-full shadow-sm" />
              <span className="text-[20px] sm:text-[24px] font-black tracking-tight text-gray-900 whitespace-nowrap">
                INTERNET <span className="text-[#e91e63]">SKILL</span>
              </span>
            </Link>
          </div>

          {/* 💻 PC Desktop Menu */}
          <div className="hidden lg:flex items-center flex-1 justify-center relative">
            <ul className="flex items-center gap-6 text-[12px] font-bold text-gray-500 uppercase tracking-widest px-2 py-2">
              {visibleCategories.map((cat, index) => (
                <li key={index} className="hover:text-[#e91e63] transition-colors whitespace-nowrap">
                  <Link href={cat.link}>{cat.name}</Link>
                </li>
              ))}
              {hiddenCategories.length > 0 && (
                <li className="relative group cursor-pointer">
                  <div className="flex items-center gap-1 hover:text-[#e91e63] transition-colors py-2">
                    MORE <ChevronDown size={14} />
                  </div>
                  <div className="absolute top-[100%] right-0 w-[200px] bg-white border border-gray-100 shadow-2xl rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    {hiddenCategories.map((cat, index) => (
                      <Link key={index} href={cat.link} className="flex items-center gap-3 px-3 py-2.5 hover:bg-pink-50 rounded-lg text-[11px] font-bold text-gray-700 hover:text-[#e91e63] transition-colors">
                        <span>{cat.icon}</span> {cat.name}
                      </Link>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>

          <Link href="/search" className="shrink-0 bg-gray-50 p-2.5 rounded-full hover:bg-pink-50 border border-gray-100 transition-all group shadow-sm hover:shadow-md">
             <Search className="text-gray-600 group-hover:text-[#e91e63] transition-colors" size={20} />
          </Link>
        </div>
      </nav>

      {/* 🌟 2. CATEGORY MAIN CONTENT */}
      <main className="max-w-[1500px] mx-auto px-4 mt-10 flex-1 w-full pb-16">
        
        {/* Category Header */}
        <div className="mb-10 text-center sm:text-left bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-3 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-3">
            <span className="text-[#e91e63]">/</span> {formattedCategory}
          </h1>
          <p className="text-gray-500 font-medium text-sm sm:text-base">
            Explore all our latest updates and articles related to {formattedCategory}.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link href={`/post/${post.slug || post._id}`} key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                <div className="aspect-[16/10] w-full bg-gray-100 overflow-hidden relative">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[#00bcd4] text-[10px] font-black uppercase tracking-widest mb-2 block">{post.category}</span>
                  <h2 className="text-[16px] font-bold text-gray-900 leading-snug group-hover:text-[#e91e63] transition-colors line-clamp-3 mb-4">{post.title}</h2>
                  <p className="text-xs font-semibold text-gray-400 mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="text-[#e91e63] group-hover:translate-x-1 transition-transform">Read →</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-2xl text-center shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
               <Search size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-3">No Posts Yet 😢</h2>
            <p className="text-gray-500 font-medium mb-8">We are working hard to bring you content in this category. Check back soon!</p>
            <Link href="/" className="bg-[#e91e63] text-white font-bold px-8 py-3 rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-500/30">
               Go Back Home
            </Link>
          </div>
        )}
      </main>

      {/* 📜 EXACT HOMEPAGE FOOTER */}
      <footer className="mt-auto bg-white border-t border-gray-200 pt-10 pb-6 text-center">
        <div className="max-w-[1500px] mx-auto px-4 flex flex-col items-center">
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Connect With Us</h4>
          <div className="flex gap-6 mb-10">
              <a href="https://www.instagram.com/internet_skill_?igsh=OXFyMDczYWhqNmE2" target="_blank" className="text-gray-400 hover:text-pink-600 transition-transform hover:scale-110"><Instagram size={24} /></a>
              <a href="https://www.facebook.com/share/14RfVdeqBj6/" target="_blank" className="text-gray-400 hover:text-blue-600 transition-transform hover:scale-110"><Facebook size={24} /></a>
              <a href="https://www.youtube.com/@Internet_Skill" target="_blank" className="text-gray-400 hover:text-red-600 transition-transform hover:scale-110"><Youtube size={24} /></a>
              <a href="https://t.me/Internetskil" target="_blank" className="text-gray-400 hover:text-blue-400 transition-transform hover:scale-110"><Send size={24} /></a>
              <a href="https://whatsapp.com/channel/0029Va5E7bAI7BeKuXSTqe1X" target="_blank" className="text-gray-400 hover:text-green-500 transition-transform hover:scale-110"><MessageCircle size={24} /></a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
              <Link href="/about" className="hover:text-[#e91e63]">About Us</Link>
              <Link href="/contact" className="hover:text-[#e91e63]">Contact Us</Link>
              <Link href="/privacy-policy" className="hover:text-[#e91e63]">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#e91e63]">Terms & Conditions</Link>
              <Link href="/disclaimer" className="hover:text-[#e91e63]">Disclaimer</Link>
          </div>
          <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">© 2026 INTERNETSKILL.IN. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}