"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, Flame, Zap, ChevronRight, Clock, X, Youtube, Instagram, Facebook, Send, MessageCircle, Home, LayoutGrid, IndianRupee, Cpu, BookOpen, TerminalSquare, Sparkles, Landmark, Smartphone, BookType, Briefcase, ChevronDown } from "lucide-react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 SEARCH STATES
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Home", link: "/", icon: <Home size={18} className="text-blue-500" /> }, 
    { name: "Apps", link: "/apps", icon: <LayoutGrid size={18} className="text-purple-500" /> }, 
    { name: "Earn Money", link: "/earn-money", icon: <IndianRupee size={18} className="text-emerald-500" /> },
    { name: "Tech News", link: "/tech-news", icon: <Cpu size={18} className="text-indigo-500" /> }, 
    { name: "Educational", link: "/educational", icon: <BookOpen size={18} className="text-yellow-500" /> }, 
    { name: "Hacking", link: "/hacking", icon: <TerminalSquare size={18} className="text-red-500" /> },
    { name: "AI Image Prompt", link: "/ai-prompt", icon: <Sparkles size={18} className="text-pink-500" /> }, 
    { name: "Sarkari Yojana", link: "/sarkari-yojana", icon: <Landmark size={18} className="text-orange-500" /> },
    { name: "Smartphone", link: "/smartphone", icon: <Smartphone size={18} className="text-cyan-500" /> }, 
    { name: "Hindi Story", link: "/hindi-story", icon: <BookType size={18} className="text-rose-500" /> }, 
    { name: "Sarkari Jobs", link: "/sarkari-jobs", icon: <Briefcase size={18} className="text-teal-500" /> },
  ];

  const visibleCategories = categories.slice(0, 8);
  const hiddenCategories = categories.slice(8);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Data fetch error");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // 🔍 LIVE SEARCH LOGIC
  const searchResults = searchQuery.trim() === "" 
    ? [] 
    : posts.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // सिर्फ टॉप 5 रिजल्ट दिखाएगा ताकि डिज़ाइन अच्छा लगे

  const defaultFeatured = { id: 1, title: "How to Earn $100/Day with AI Image Prompts (Secret Trick)", category: "EARN MONEY", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800", slug: "#" };
  const displayFeatured = posts.length > 0 ? posts[0] : defaultFeatured;
  const displayTrending = posts.length > 1 ? posts.slice(1, 4) : []; 
  const displayRecent = posts.length > 0 ? posts : [];

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-900 font-sans pb-10">
      
      {/* 🚀 1. ADVANCED PREMIUM HEADER */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm relative">
        <div className="max-w-[1500px] mx-auto px-4 py-3 flex justify-between items-center gap-6">
          
          <div className="flex items-center gap-3 shrink-0">
            <Menu className="text-gray-800 cursor-pointer lg:hidden hover:text-[#e91e63] transition-colors" size={28} onClick={() => setIsMenuOpen(true)} />
            <Link href="/" className="flex items-center gap-2">
              <img src="https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/20250611_004115_20250611_131539-imagetourl.cloud-1770749760299-z8zjkk.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-full shadow-sm" />
              <span className="text-[20px] sm:text-[24px] font-black tracking-tight text-gray-900 whitespace-nowrap">
                INTERNET <span className="text-[#e91e63]">SKILL</span>
              </span>
            </Link>
          </div>

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

          {/* 🔍 Premium Search Button (अब नया पेज नहीं खोलेगा, पॉपअप खोलेगा) */}
          <button onClick={() => setIsSearchOpen(true)} className="shrink-0 bg-gray-50 p-2.5 rounded-full hover:bg-pink-50 border border-gray-100 transition-all group shadow-sm hover:shadow-md outline-none">
             <Search className="text-gray-600 group-hover:text-[#e91e63] transition-colors" size={20} />
          </button>
        </div>
      </nav>

      {/* 🚀 LIVE SEARCH OVERLAY (यही है वो जादुई चीज़) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-16 sm:pt-24 px-4">
           {/* Dark Background (क्लिक करने पर बंद हो जाएगा) */}
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}></div>
           
           {/* Search Box */}
           <div className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center p-4 sm:p-6 border-b border-gray-100">
                 <Search className="text-[#e91e63] ml-2 mr-4 shrink-0" size={28} />
                 <input 
                   autoFocus
                   type="text" 
                   placeholder="Search posts, apps, tricks..." 
                   className="flex-1 text-xl sm:text-2xl font-bold text-gray-800 outline-none bg-transparent placeholder-gray-300"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="p-2 bg-gray-50 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                    <X size={24} />
                 </button>
              </div>
              
              {/* Live Results Area */}
              <div className="max-h-[60vh] overflow-y-auto bg-gray-50/50">
                 {searchQuery && searchResults.length > 0 ? (
                   <div className="p-4 sm:p-6 space-y-3">
                     <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Top Results</p>
                     {searchResults.map(post => (
                       <Link key={post._id} href={`/post/${post._id}`} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-4 p-3 bg-white hover:bg-pink-50 border border-gray-100 rounded-2xl shadow-sm transition-all group">
                         <img src={post.image} className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-xl" />
                         <div>
                           <h4 className="text-[15px] sm:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#e91e63] transition-colors">{post.title}</h4>
                           <span className="text-[10px] text-[#00bcd4] font-black uppercase tracking-widest">{post.category}</span>
                         </div>
                       </Link>
                     ))}
                   </div>
                 ) : searchQuery && searchResults.length === 0 ? (
                   <div className="p-12 text-center">
                     <span className="text-4xl block mb-3">🔍</span>
                     <p className="text-gray-500 font-bold text-lg">No results found for "{searchQuery}"</p>
                   </div>
                 ) : (
                   <div className="p-12 text-center text-gray-400">
                     <p className="font-bold">Start typing to search magically... ✨</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* 📱 Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 w-[75%] max-w-[300px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <span className="font-black text-lg tracking-widest uppercase text-gray-800">MENU</span>
              <X className="text-gray-600 cursor-pointer hover:text-[#e91e63] transition-colors" size={26} onClick={() => setIsMenuOpen(false)} />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3 ml-2 mt-1">Explore Categories</h3>
              <ul className="space-y-1">
                {categories.map((cat, index) => (
                  <li key={index}>
                    <Link href={cat.link} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 py-3 px-3 hover:bg-pink-50 rounded-lg transition-colors group">
                      <span className="group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <span className="text-[14px] font-bold text-gray-700 group-hover:text-[#e91e63] transition-colors">{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 💰 Top AdSense Box */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="w-full h-20 bg-gray-100 border border-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold rounded-lg tracking-widest uppercase">
          [ AdSense Banner Ad ]
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-6 space-y-8">
        {/* 🌟 1. Featured Big Post */}
        <section>
          <Link href={displayFeatured._id ? `/post/${displayFeatured._id}` : "#"} className="block relative rounded-2xl overflow-hidden shadow-lg group">
            <div className="aspect-[16/10] sm:aspect-[21/9] w-full bg-gray-200">
              <img src={displayFeatured.image} alt={displayFeatured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
              <span className="w-max bg-[#00bcd4] text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider mb-2">
                {displayFeatured.category}
              </span>
              <h1 className="text-white text-xl sm:text-3xl font-bold leading-tight drop-shadow-md group-hover:text-pink-400 transition-colors">
                {displayFeatured.title}
              </h1>
            </div>
          </Link>
        </section>

        {/* 🔥 2. Trending Carousel */}
        {displayTrending.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4 border-l-4 border-[#e91e63] pl-2">
              <Flame className="text-[#e91e63]" size={22} />
              <h2 className="text-[20px] font-black text-gray-900 tracking-tight uppercase">Trending Now</h2>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 [&::-webkit-scrollbar]:hidden snap-x">
              {displayTrending.map((post) => (
                <Link href={`/post/${post._id}`} key={post._id} className="min-w-[200px] w-[200px] sm:w-[250px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden snap-start group shrink-0">
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                    <div className="absolute top-1 left-1 bg-[#e91e63] text-white text-[8px] font-black px-1.5 rounded-sm z-10">HOT</div>
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-[14px] font-bold text-gray-800 leading-snug group-hover:text-[#e91e63] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ⚡ 3. Feed List View */}
        <section>
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-2">
              <Zap className="text-blue-500" size={22} />
              <h2 className="text-[20px] font-black text-gray-900 tracking-tight uppercase">Latest Updates</h2>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {loading ? (
                <p className="text-center font-bold text-gray-400">Loading Posts...</p>
            ) : displayRecent.map((post) => (
              <Link href={`/post/${post._id}`} key={post._id || post.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4 group hover:shadow-md transition-shadow">
                <div className="w-28 h-24 sm:w-40 sm:h-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[#00bcd4] text-[10px] font-black uppercase tracking-widest block mb-1">
                      {post.category}
                    </span>
                    <h3 className="text-[15px] sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-[#e91e63] transition-colors line-clamp-2 sm:line-clamp-3">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 mt-2">
                    <Clock size={12} /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just Now"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* 📜 Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200 pt-10 pb-6 text-center">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
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