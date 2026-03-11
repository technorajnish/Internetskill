"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Send, LayoutDashboard, Globe, Settings, Link as LinkIcon, UploadCloud, Search, Trash2, Edit, List, Save, ShieldCheck, LogOut, Pin, Eye, MessageSquare } from "lucide-react";

const CustomEditor = dynamic(() => import("./Editor"), { ssr: false });

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("newPost");
  const [content, setContent] = useState("");
  const [mounted, setMounted] = useState(false);
  const [imageMode, setImageMode] = useState("url"); 
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true); 
  
  const [postsList, setPostsList] = useState([]); 
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [editId, setEditId] = useState(null); 

  // 🚀 Server Upload Loading State
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "", slug: "", category: "Home",
    image: "", metaTitle: "", metaDesc: "", keywords: "",
    appLink: "", btnText: "Download Now", isPinned: false 
  });

  const [securityData, setSecurityData] = useState({ newUsername: "", newPassword: "", confirmPassword: "" });
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  // 🌟 NEW 6 MASTER CATEGORIES (+ Home)
  const categories = ["Home", "Apps & Website", "Earn Money", "Tech News", "Ethical Hacking", "AI Prompt", "Sarkari Yojana"];

  useEffect(() => { 
    const isAdmin = localStorage.getItem("isISAdmin");
    if (isAdmin !== "true") {
      router.push("/admin"); 
    } else {
      setIsAuthChecking(false);
      setMounted(true); 
      fetchPosts(); 
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isISAdmin"); 
    router.push("/admin"); 
  };

  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const res = await fetch("/api/posts");
      if(res.ok){
        const data = await res.json();
        setPostsList(data); 
      }
    } catch (error) {
      console.log("Error loading posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleDelete = async (id) => {
    if(confirm("⚠️ क्या तुम सच में इस पोस्ट को डिलीट करना चाहते हो?")){
      try {
        const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
        if(res.ok){
          alert("✅ पोस्ट हमेशा के लिए डिलीट हो गई!");
          fetchPosts(); 
        } else {
          alert("❌ डिलीट करने में प्रॉब्लम आ रही है।");
        }
      } catch (error) {
        alert("Server Error!");
      }
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if(confirm("⚠️ इस कमेंट को हमेशा के लिए उड़ा दें?")){
      try {
        const res = await fetch(`/api/posts?action=deleteComment&postId=${postId}&commentId=${commentId}`, { method: "DELETE" });
        if(res.ok){
           fetchPosts(); 
        }
      } catch (error) {
        console.log("Error deleting comment");
      }
    }
  };

  const handleEdit = (post) => {
    setEditId(post._id); 
    setFormData({
      title: post.title, slug: post.slug, category: post.category || "Home",
      image: post.image || "", metaTitle: post.metaTitle || "", metaDesc: post.metaDesc || "", 
      keywords: post.keywords || "", appLink: post.appLink || "", btnText: post.btnText || "Download Now",
      isPinned: post.isPinned || false 
    });
    setContent(post.content);
    setActiveTab("newPost"); 
  };

  const resetForm = () => {
    setEditId(null);
    setContent("");
    setFormData({ title: "", slug: "", category: "Home", image: "", metaTitle: "", metaDesc: "", keywords: "", appLink: "", btnText: "Download Now", isPinned: false });
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setFormData({ ...formData, title, slug });
  };

  // 🚀 MEGA UPDATE: Cloudinary Upload System
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      // यह फोटो को सीधे Cloudinary के API पर भेजेगा
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        // Cloudinary से हमें 'url' मिलता है, सिर्फ उसी छोटी लिंक को सेव कर रहे हैं!
        setFormData({ ...formData, image: data.url }); 
      } else {
        alert("❌ फोटो अपलोड फेल हो गया!");
      }
    } catch (error) {
      console.error(error);
      alert("❌ सर्वर एरर: फोटो अपलोड नहीं हुई।");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !content) {
      alert("⚠️ भाई, कम से कम Title और Content तो लिखना ज़रूरी है!");
      return;
    }
    setIsPublishing(true);

    try {
      const finalData = { ...formData, content }; 
      let res;

      if (editId) {
        res = await fetch(`/api/posts?id=${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData)
        });
      } else {
        res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData)
        });
      }

      if (res.ok) {
        alert(editId ? "🔥 पोस्ट सफलतापूर्वक अपडेट हो गई!" : "🔥 शानदार! नई पोस्ट पब्लिश हो गई!");
        resetForm(); 
        fetchPosts(); 
        setActiveTab("managePosts"); 
      } else {
        alert("❌ एरर: काम पूरा नहीं हो पाया।");
      }
    } catch (error) {
      console.log(error);
      alert("❌ Server Error!");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUpdateSecurity = async () => {
    if (!securityData.newUsername || !securityData.newPassword) {
      alert("⚠️ Username और Password दोनों डालना ज़रूरी है!");
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("❌ Passwords आपस में मैच नहीं कर रहे हैं! ध्यान से चेक करो।");
      return;
    }

    setIsUpdatingSecurity(true);
    try {
      const res = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newUsername: securityData.newUsername,
          newPassword: securityData.newPassword
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
        setSecurityData({ newUsername: "", newPassword: "", confirmPassword: "" }); 
      } else {
        alert("❌ एरर: " + data.message);
      }
    } catch (error) {
      alert("❌ Server Error!");
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  if (isAuthChecking || !mounted) return <div className="min-h-screen bg-[#020617]"></div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex font-sans">
      
      {/* 🚀 LEFT SIDEBAR */}
      <div className="w-72 bg-[#0f172a] p-6 hidden lg:flex flex-col border-r border-slate-800 shadow-2xl">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-10 italic uppercase tracking-tighter">IS Panel V2</h2>
        <nav className="space-y-4 flex-1">
          <div onClick={() => { setActiveTab("newPost"); resetForm(); }} className={`p-4 rounded-2xl font-bold flex items-center gap-3 cursor-pointer transition-all ${activeTab === "newPost" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "hover:bg-slate-800 text-slate-400"}`}>
            <LayoutDashboard size={20}/> {editId ? "Edit Post" : "New Post"}
          </div>
          <div onClick={() => setActiveTab("managePosts")} className={`p-4 rounded-2xl font-bold flex items-center gap-3 cursor-pointer transition-all ${activeTab === "managePosts" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40" : "hover:bg-slate-800 text-slate-400"}`}>
            <List size={20}/> Manage Posts
          </div>
          <div onClick={() => setActiveTab("settings")} className={`p-4 rounded-2xl font-bold flex items-center gap-3 cursor-pointer transition-all ${activeTab === "settings" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "hover:bg-slate-800 text-slate-400"}`}>
            <Settings size={20}/> Security
          </div>
          <a href="/" target="_blank" className="p-4 hover:bg-slate-800 rounded-2xl cursor-pointer transition-all flex items-center gap-3 text-slate-400 mt-10 border border-slate-800">
            <Globe size={20}/> Visit Live Site
          </a>
          
          <div onClick={handleLogout} className="p-4 hover:bg-red-500/10 hover:text-red-500 rounded-2xl cursor-pointer transition-all flex items-center gap-3 text-slate-400 border border-slate-800 hover:border-red-500/30">
            <LogOut size={20}/> Logout
          </div>
        </nav>
      </div>

      {/* 🌟 MAIN AREA */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* ======================= TAB 1: NEW POST / EDIT POST ======================= */}
          {activeTab === "newPost" && (
            <div className="fade-in">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-slate-800 pb-8">
                <div>
                  <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
                    {editId ? "Update Post ✍️" : "Advance Publisher 🚀"}
                  </h1>
                  <p className="text-emerald-400 font-bold text-sm bg-emerald-950/30 px-3 py-1 rounded-full inline-block">SEO & PlayStore Optimized</p>
                </div>
                
                <div className="flex gap-4">
                  {editId && (
                    <button onClick={resetForm} className="bg-slate-800 px-8 py-4 rounded-[2rem] font-black text-white hover:bg-slate-700 transition-all uppercase tracking-widest">
                      Cancel
                    </button>
                  )}
                  <button onClick={handlePublish} disabled={isPublishing} className={`${isPublishing ? "bg-slate-600" : (editId ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500")} active:scale-95 px-12 py-4 rounded-[2rem] font-black text-white flex items-center gap-3 shadow-2xl transition-all uppercase tracking-widest`}>
                    {editId ? <Save size={20}/> : <Send size={20}/>} 
                    {isPublishing ? "PROCESSING..." : (editId ? "UPDATE POST" : "PUBLISH POST")}
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  
                  <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between cursor-pointer hover:border-pink-500/50 transition-all" onClick={() => setFormData({...formData, isPinned: !formData.isPinned})}>
                     <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.isPinned ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          <Pin size={20} />
                       </div>
                       <div>
                         <h3 className="text-lg font-bold text-white">Pin to Homepage</h3>
                         <p className="text-xs text-slate-500">Show this post at the top of the homepage.</p>
                       </div>
                     </div>
                     <div className={`w-14 h-8 rounded-full relative transition-colors ${formData.isPinned ? 'bg-pink-500' : 'bg-slate-700'}`}>
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${formData.isPinned ? 'right-1' : 'left-1'}`}></div>
                     </div>
                  </div>

                  <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-6">
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Post Title</label>
                      <input type="text" value={formData.title} onChange={handleTitleChange} placeholder="Enter catching title here..." className="w-full bg-[#020617] p-5 rounded-2xl text-2xl font-bold text-white outline-none border border-slate-800 focus:border-blue-500 transition-all placeholder:text-slate-700" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">Full Content & Design</label>
                      <CustomEditor value={content} onChange={setContent} />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-6">
                    <div className="flex items-center gap-2 text-blue-400 mb-2"><Search size={24} /><h3 className="text-xl font-black uppercase tracking-widest">SEO Mastery</h3></div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-2">Custom URL (Slug)</label>
                      <div className="flex items-center bg-[#020617] border border-slate-800 rounded-xl overflow-hidden focus-within:border-blue-500 transition-all">
                        <span className="bg-slate-800 text-slate-400 px-4 py-4 font-mono text-sm">internetskill.in/</span>
                        <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-transparent p-4 text-white outline-none font-mono text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2">Meta Title</label>
                        <input type="text" value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} placeholder="Title for Google Search..." className="w-full bg-[#020617] border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2">Focus Keywords</label>
                        <input type="text" value={formData.keywords} onChange={(e) => setFormData({...formData, keywords: e.target.value})} placeholder="hacking, apps, earn money..." className="w-full bg-[#020617] border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-2">Meta Description</label>
                      <textarea rows="3" value={formData.metaDesc} onChange={(e) => setFormData({...formData, metaDesc: e.target.value})} placeholder="Brief description to rank on search engines..." className="w-full bg-[#020617] border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm"></textarea>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-800 pb-4">Feature Image</h3>
                    <div className="flex bg-[#020617] rounded-xl p-1 border border-slate-800">
                      <button onClick={() => setImageMode("upload")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${imageMode === "upload" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"}`}>UPLOAD</button>
                      <button onClick={() => setImageMode("url")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${imageMode === "url" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"}`}>IMAGE URL</button>
                    </div>

                    {imageMode === "upload" ? (
                      <label className="border-2 border-dashed border-slate-700 h-40 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:bg-blue-950/20 transition-all cursor-pointer relative overflow-hidden">
                        {isUploadingImage ? (
                          <div className="flex flex-col items-center">
                            <UploadCloud size={40} className="mb-2 text-blue-500 animate-bounce" />
                            <p className="text-xs font-bold uppercase text-blue-500">Uploading File...</p>
                          </div>
                        ) : formData.image ? (
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <><UploadCloud size={40} className="mb-2" /><p className="text-xs font-bold uppercase">Click to Upload</p></>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploadingImage} />
                      </label>
                    ) : (
                      <div>
                        <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="Paste Image Link Here..." className="w-full bg-[#020617] border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 text-sm" />
                        {formData.image && (
                          <div className="mt-4 h-32 rounded-xl overflow-hidden border border-slate-700">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase block mb-2">Category</label>
                      <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[#020617] border border-slate-800 p-4 rounded-xl text-white font-bold outline-none cursor-pointer appearance-none">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-5">
                    <div className="flex items-center gap-2 text-emerald-500 mb-2"><LinkIcon size={20} /><h3 className="text-sm font-black uppercase tracking-widest">Action Button</h3></div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Button Text</label>
                      <input type="text" value={formData.btnText} onChange={(e) => setFormData({...formData, btnText: e.target.value})} className="w-full bg-[#020617] border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-emerald-500 text-sm font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Target URL (Playstore / Direct)</label>
                      <input type="url" value={formData.appLink} onChange={(e) => setFormData({...formData, appLink: e.target.value})} placeholder="https://..." className="w-full bg-[#020617] border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-emerald-500 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 2: MANAGE POSTS ======================= */}
          {activeTab === "managePosts" && (
            <div className="fade-in">
              <header className="mb-10 border-b border-slate-800 pb-6">
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Manage Posts 📝</h1>
                <p className="text-slate-400 font-medium">Edit, delete, and check views or comments on your posts.</p>
              </header>

              <div className="bg-[#0f172a] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                {isLoadingPosts ? (
                  <div className="p-10 text-center text-slate-400 font-bold">Loading Posts...</div>
                ) : postsList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#020617] text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
                          <th className="p-5 font-black">Post Title</th>
                          <th className="p-5 font-black text-center">Stats</th>
                          <th className="p-5 font-black">Category</th>
                          <th className="p-5 font-black text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {postsList.map((post) => (
                          <tr key={post._id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                            <td className="p-5 font-bold text-white">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 relative">
                                  {post.isPinned && <div className="absolute top-0 right-0 bg-pink-500 text-[8px] px-1 rounded-bl-lg">PIN</div>}
                                  <img src={post.image || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="Thumb"/>
                                </div>
                                <div className="flex flex-col">
                                  <span className="line-clamp-1">{post.title}</span>
                                  <span className="text-xs text-slate-500 mt-1">{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </td>
                            
                            <td className="p-5 text-center">
                              <div className="flex items-center justify-center gap-4 text-xs font-bold">
                                <div className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md" title="Total Views">
                                  <Eye size={14}/> {post.views || 0}
                                </div>
                                <details className="relative group/comments cursor-pointer">
                                  <summary className="list-none flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md" title="Total Comments">
                                    <MessageSquare size={14}/> {post.comments ? post.comments.length : 0}
                                  </summary>
                                  {post.comments && post.comments.length > 0 && (
                                    <div className="absolute top-[120%] right-0 w-64 bg-[#020617] border border-slate-700 shadow-2xl rounded-xl p-3 z-50 text-left max-h-48 overflow-y-auto">
                                       <h4 className="text-[10px] text-slate-400 uppercase mb-2 border-b border-slate-800 pb-1">Manage Comments</h4>
                                       {post.comments.map(c => (
                                         <div key={c._id} className="bg-slate-800/50 p-2 rounded-lg mb-2 flex flex-col gap-1">
                                           <div className="flex justify-between items-center">
                                             <span className="text-xs text-white font-bold">{c.name}</span>
                                             <button onClick={() => handleDeleteComment(post._id, c._id)} className="text-red-400 hover:text-red-500"><Trash2 size={12}/></button>
                                           </div>
                                           <span className="text-xs text-slate-400 line-clamp-2">{c.text}</span>
                                         </div>
                                       ))}
                                    </div>
                                  )}
                                </details>
                              </div>
                            </td>

                            <td className="p-5 text-purple-400 text-sm font-bold uppercase">{post.category}</td>
                            <td className="p-5 flex justify-end gap-3 h-full items-center pt-8">
                              <button onClick={() => handleEdit(post)} className="w-10 h-10 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all" title="Edit Post"><Edit size={16}/></button>
                              <button onClick={() => handleDelete(post._id)} className="w-10 h-10 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all" title="Delete Post"><Trash2 size={16}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-10 text-center text-slate-500 font-bold">No posts found. Publish your first post!</div>
                )}
              </div>
            </div>
          )}

          {/* ======================= TAB 3: SETTINGS (Security) ======================= */}
          {activeTab === "settings" && (
            <div className="fade-in max-w-2xl mx-auto">
              <header className="mb-10 border-b border-slate-800 pb-6 text-center">
                <ShieldCheck className="mx-auto text-purple-500 mb-4" size={48} />
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Security 🛡️</h1>
                <p className="text-slate-400 font-medium">Update your Admin ID and Password to secure your panel.</p>
              </header>

              <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-6">
                 <div>
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">New Admin ID / Username</label>
                   <input 
                     type="text" 
                     value={securityData.newUsername}
                     onChange={(e) => setSecurityData({...securityData, newUsername: e.target.value})}
                     placeholder="Enter new username..." 
                     className="w-full bg-[#020617] p-4 rounded-xl text-white outline-none border border-slate-800 focus:border-purple-500 transition-all" 
                   />
                 </div>
                 <div>
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">New Password</label>
                   <input 
                     type="password" 
                     value={securityData.newPassword}
                     onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                     placeholder="••••••••" 
                     className="w-full bg-[#020617] p-4 rounded-xl text-white outline-none border border-slate-800 focus:border-purple-500 transition-all" 
                   />
                 </div>
                 <div>
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">Confirm Password</label>
                   <input 
                     type="password" 
                     value={securityData.confirmPassword}
                     onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                     placeholder="••••••••" 
                     className="w-full bg-[#020617] p-4 rounded-xl text-white outline-none border border-slate-800 focus:border-purple-500 transition-all" 
                   />
                 </div>
                 <button 
                   onClick={handleUpdateSecurity}
                   disabled={isUpdatingSecurity}
                   className={`w-full ${isUpdatingSecurity ? "bg-slate-600" : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/30"} text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all mt-4`}
                 >
                   {isUpdatingSecurity ? "UPDATING..." : "UPDATE SECURITY"}
                 </button>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}}/>
    </div>
  );
}