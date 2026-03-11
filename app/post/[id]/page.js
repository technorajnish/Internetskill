import Link from "next/link";
import { revalidatePath } from "next/cache"; 
import mongoose from "mongoose";
import Post from "@/models/Post";
import { Search, Menu, Zap, Clock, Facebook, MessageCircle, Twitter, MessageSquare, TrendingUp, Instagram, Youtube, Send, Home, LayoutGrid, IndianRupee, Cpu, BookOpen, TerminalSquare, Sparkles, Landmark, Smartphone, BookType, Briefcase, ChevronDown, User, Mail } from "lucide-react";

// 🛠️ MEGA FIX: Global Database Connection (No more timeouts!)
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 सेकंड से ज्यादा नहीं अटकेगा
    });
    isConnected = true;
    console.log("✅ Database Connected Successfully!");
  } catch (error) {
    console.log("❌ DB Connection Error:", error);
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);
  
  try {
    await connectDB();
    
    let post;
    if (mongoose.Types.ObjectId.isValid(decodedId)) {
      post = await Post.findById(decodedId).lean();
    }
    if (!post) {
      post = await Post.findOne({ slug: decodedId }).lean();
    }

    if (!post) return { title: "Post Not Found" };

    return {
      title: post.metaTitle || post.title,
      description: post.metaDesc || "Read the latest updates on Internet Skill",
      keywords: post.keywords || "tech, updates, apps, earn money",
      openGraph: {
        title: post.title,
        description: post.metaDesc || "Click to read full details...",
        url: `https://internetskill.in/post/${post.slug || post._id}`,
        siteName: 'Internet Skill',
        images: [
          {
            url: post.image || "https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/20250611_004115_20250611_131539-imagetourl.cloud-1770749760299-z8zjkk.jpg",
            width: 1200,
            height: 630,
          }
        ],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metaDesc || "Click to read full details...",
        images: [post.image],
      },
    };
  } catch (error) {
    return { title: "Internet Skill" };
  }
}

export default async function SinglePostPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);

  try {
    await connectDB();
    
    // 🚀 पोस्ट को ढूँढना
    let post;
    if (mongoose.Types.ObjectId.isValid(decodedId)) {
      post = await Post.findById(decodedId).lean();
    }
    if (!post) {
      post = await Post.findOne({ slug: decodedId }).lean();
    }

    if (!post) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found 😢</h1>
            <p className="text-gray-500 mb-6">यह पोस्ट डेटाबेस में नहीं मिली।</p>
            <Link href="/" className="text-[#e91e63] font-bold hover:underline">वापस होमपेज पर जाएँ</Link>
          </div>
        </div>
      );
    }

    // 🔥 बैकग्राउंड में पोस्ट के 'Views' बढ़ाना
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    // 2. पोस्ट के कमेंट्स लाना
    const postComments = post.comments ? [...post.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

    // 💬 MEGA UPDATE: MongoDB में कमेंट सेव करना
    async function postComment(formData) {
      "use server"; 
      const name = formData.get("name");
      const text = formData.get("text");
      
      if (name && text) {
        await connectDB();
        await Post.findByIdAndUpdate(post._id, {
          $push: { comments: { name, text, createdAt: new Date() } }
        });
        revalidatePath(`/post/${id}`); 
      }
    }

    // 3. Latest और Trending पोस्ट्स लाना (MongoDB से)
    const otherPosts = await Post.find({ _id: { $ne: post._id } }).sort({ createdAt: -1 }).limit(10).lean();
    const trendingPostsRaw = await Post.find({ _id: { $ne: post._id } }).sort({ views: -1, createdAt: -1 }).limit(4).lean();
    
    const latestPosts = otherPosts.slice(0, 4);
    const relatedPosts = otherPosts.slice(0, 2);

    const wordCount = post.content ? post.content.split(/\s+/).length : 0;
    const readingTime = Math.ceil(wordCount / 200) || 1;

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

    const shareText = encodeURIComponent(`Check out this post: ${post.title}`);

    return (
      <div className="min-h-screen bg-[#f9fafb] text-gray-900 font-sans flex flex-col selection:bg-[#e91e63] selection:text-white">
        
        {/* 🚀 1. EXACT HOMEPAGE HEADER */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm relative">
          <div className="max-w-[1500px] mx-auto px-4 py-3 flex justify-between items-center gap-6">
            <div className="flex items-center gap-3 shrink-0">
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

        {/* 🌟 2. MAIN CONTENT AREA */}
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 mt-8 w-full flex flex-col lg:flex-row gap-8 flex-1 pb-16 relative">
          
          <aside className="hidden xl:flex flex-col gap-4 w-[50px] sticky top-[100px] h-fit items-center pt-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Follow Us</span>
            <div className="w-[2px] h-8 bg-gray-200 mb-2"></div>
            <a href="https://www.instagram.com/internet_skill_?igsh=OXFyMDczYWhqNmE2" target="_blank" className="w-11 h-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all hover:-translate-y-1"><Instagram size={18} /></a>
            <a href="https://www.facebook.com/share/14RfVdeqBj6/" target="_blank" className="w-11 h-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1"><Facebook size={18} /></a>
            <a href="https://www.youtube.com/@Internet_Skill" target="_blank" className="w-11 h-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all hover:-translate-y-1"><Youtube size={18} /></a>
            <a href="https://t.me/Internetskil" target="_blank" className="w-11 h-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-all hover:-translate-y-1"><Send size={18} /></a>
          </aside>

          <article className="lg:w-[68%] xl:w-[65%] w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
            
            <div className="p-5 sm:p-10 pb-0">
              <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest">
                <Link href="/" className="text-[#e91e63] hover:underline">{post.category || "Technology"}</Link>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400 flex items-center gap-1"><Clock size={14} /> {readingTime} MIN READ</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.2] mb-6 tracking-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 mb-8">
                <div className="flex items-center gap-3">
                  <img src="https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/20250611_004115_20250611_131539-imagetourl.cloud-1770749760299-z8zjkk.jpg" className="w-11 h-11 rounded-full object-cover shadow-sm border border-gray-100" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Rajnish Kumar</p>
                    <p className="text-xs text-gray-500">{post.createdAt || post.date ? new Date(post.createdAt || post.date).toLocaleDateString() : "Just Now"}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a href={`https://api.whatsapp.com/send?text=${shareText}`} target="_blank" className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all"><MessageCircle size={16} /></a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=https://internetskill.in`} target="_blank" className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Facebook size={16} /></a>
                  <a href="#comments" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-800 hover:text-white transition-all"><MessageSquare size={16} /></a>
                </div>
              </div>
            </div>

            {post.image && (
              <div className="px-5 sm:px-10 mb-8">
                <img src={post.image} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-xl border border-gray-100" />
              </div>
            )}

            <div 
              className="px-5 sm:px-10 text-[17px] sm:text-[20px] text-gray-700 leading-[1.8] sm:leading-[2.1] custom-html-content w-full overflow-hidden break-words"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {(post.appLink || post.btnLink) && (
              <div className="px-5 sm:px-10 mt-10 mb-8 flex justify-center">
                 <a href={post.appLink || post.btnLink} target="_blank" rel="noopener noreferrer" className="bg-[#e91e63] text-white text-lg font-black px-10 py-4 rounded-xl shadow-lg hover:bg-pink-700 hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2 text-center">
                    <Zap size={20} />
                    {post.btnText || post.buttonText || "Download Now"}
                 </a>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div className="mx-5 sm:mx-10 mt-12 mb-8 pt-8 border-t border-gray-100">
                <h3 className="text-xl font-black text-gray-900 mb-6">💡 Related Posts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedPosts.map((rPost) => (
                    <Link href={`/post/${rPost.slug || String(rPost._id)}`} key={String(rPost._id)} className="group flex flex-col gap-3">
                      <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                        <img src={rPost.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <h4 className="text-[16px] font-bold text-gray-900 leading-snug group-hover:text-[#e91e63] transition-colors line-clamp-2">{rPost.title}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 💬 REAL COMMENT SECTION */}
            <div id="comments" className="bg-gray-50 p-5 sm:p-10 border-t border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare size={20}/> Comments ({postComments.length})
              </h3>
              
              {postComments.length > 0 && (
                <div className="mb-8 space-y-4">
                  {postComments.map((c, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#e91e63]/10 flex items-center justify-center text-[#e91e63] font-bold uppercase">
                          {c.name ? c.name.charAt(0) : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                          <p className="text-xs text-gray-400">{new Date(c.createdAt || c.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-[15px] pl-11">{c.text || c.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ✍️ Add New Comment Form */}
              <form action={postComment} className="bg-white p-5 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-800 mb-5 uppercase tracking-widest border-b border-gray-100 pb-3">Leave a Reply</h4>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                   <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-1 focus-within:border-[#e91e63] transition-colors">
                     <User className="text-gray-400 shrink-0" size={18} />
                     <input type="text" name="name" required placeholder="Your Name *" className="w-full bg-transparent py-3 outline-none text-[15px] font-medium text-gray-800" />
                   </div>
                   <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-1 focus-within:border-[#e91e63] transition-colors">
                     <Mail className="text-gray-400 shrink-0" size={18} />
                     <input type="email" name="email" required placeholder="Your Email *" className="w-full bg-transparent py-3 outline-none text-[15px] font-medium text-gray-800" />
                   </div>
                 </div>

                 <textarea name="text" required rows="4" placeholder="Share your thoughts about this post... *" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 placeholder-gray-400 resize-none outline-none focus:border-[#e91e63] transition-colors text-[15px] mb-4"></textarea>
                 
                 <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400 font-medium hidden sm:block">Your email address will not be published.</p>
                    <button type="submit" className="bg-gray-900 text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-[#e91e63] transition-colors shadow-lg active:scale-95 w-full sm:w-auto">
                      Post Comment
                    </button>
                 </div>
              </form>
            </div>

          </article>

          <aside className="lg:w-[32%] xl:w-[30%] space-y-8 sticky top-[100px] h-fit pb-10">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <TrendingUp className="text-[#e91e63]" size={18}/> Trending Now
              </h3>
              <div className="flex flex-col gap-5">
                {trendingPostsRaw.map((tPost) => (
                  <Link href={`/post/${tPost.slug || String(tPost._id)}`} key={String(tPost._id)} className="group flex gap-3 items-center">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-100 relative">
                       <div className="absolute top-1 left-1 bg-[#e91e63] text-white text-[8px] font-black px-1.5 rounded-sm z-10">HOT</div>
                       <img src={tPost.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-gray-800 leading-snug group-hover:text-[#e91e63] transition-colors line-clamp-2">{tPost.title}</h4>
                      <span className="text-[10px] font-bold text-gray-400 mt-1 block uppercase tracking-wider">{tPost.category || "Viral"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Zap className="text-blue-500" size={18}/> Latest Updates
              </h3>
              <div className="flex flex-col gap-5">
                {latestPosts.map((lPost) => (
                  <Link href={`/post/${lPost.slug || String(lPost._id)}`} key={String(lPost._id)} className="group flex gap-3 items-center">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                       <img src={lPost.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{lPost.title}</h4>
                      <span className="text-[10px] font-semibold text-gray-400 mt-1 block">{new Date(lPost.createdAt || lPost.date || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-12 bg-white border-t border-gray-200 pt-10 pb-6 text-center">
          <div className="max-w-[1500px] mx-auto px-4 flex flex-col items-center">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Connect With Us</h4>
            <div className="flex gap-6 mb-10">
                <a href="https://www.instagram.com/internet_skill_?igsh=OXFyMDczYWhqNmE2" target="_blank" className="text-gray-400 hover:text-pink-600 transition-transform hover:scale-110"><Instagram size={24} /></a>
                <a href="https://www.facebook.com/share/14RfVdeqBj6/" target="_blank" className="text-gray-400 hover:text-blue-600 transition-transform hover:scale-110"><Facebook size={24} /></a>
                <a href="https://www.youtube.com/@Internet_Skill" target="_blank" className="text-gray-400 hover:text-red-600 transition-transform hover:scale-110"><Youtube size={24} /></a>
                <a href="https://t.me/Internetskil" target="_blank" className="text-gray-400 hover:text-blue-400 transition-transform hover:scale-110"><Send size={24} /></a>
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

        <style dangerouslySetInnerHTML={{__html: `
          .custom-html-content { 
              color: #374151; 
              word-wrap: break-word; 
              overflow-wrap: break-word; 
              word-break: break-word; 
              -webkit-hyphens: auto;
              hyphens: auto;
              max-width: 100%;
          }
          .custom-html-content h2, .custom-html-content h3 { font-weight: 900; color: #111827; margin-top: 2em; margin-bottom: 0.8em; line-height: 1.3; letter-spacing: -0.01em; }
          .custom-html-content h2 { font-size: 1.7rem; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.3em; }
          .custom-html-content h3 { font-size: 1.4rem; }
          .custom-html-content p { margin-bottom: 1.5em; max-width: 100%; }
          .custom-html-content img { border-radius: 0.5rem; margin-top: 2em; margin-bottom: 2em; max-width: 100%; height: auto; border: 1px solid #f3f4f6; display: block; }
          .custom-html-content a { color: #e91e63; font-weight: bold; word-break: break-all; }
          .custom-html-content ul { list-style: disc; padding-left: 1.5em; margin-bottom: 2em; }
          .custom-html-content ul li { margin-bottom: 0.5em; }
        `}} />
      </div>
    );

  } catch (error) {
    console.error("Single Post Page Error:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
         <h1 className="text-3xl font-black text-red-600 mb-2">एरर आ रहा है ⚠️</h1>
         <p className="text-gray-500 mb-6">डेटाबेस से कनेक्ट नहीं हो पा रहा है।</p>
         <Link href="/" className="bg-[#e91e63] text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-700">वापस होमपेज पर जाएँ</Link>
      </div>
    );
  }
}