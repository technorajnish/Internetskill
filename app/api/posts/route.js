import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// 📂 डेटाबेस फाइल का रास्ता (यह आपके प्रोजेक्ट में database.json बनाएगा जो परमानेंट रहेगा)
const dbPath = path.join(process.cwd(), "database.json");

// 🛠️ हेल्पर फंक्शन: डेटाबेस फाइल को पढ़ने के लिए
async function getDB() {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    // अगर फाइल नहीं है, तो नई बना देगा (डेटा उड़ने का कोई डर नहीं)
    return { posts: [], comments: [] };
  }
}

// 🛠️ हेल्पर फंक्शन: डेटाबेस फाइल में सेव करने के लिए
async function saveDB(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

// 🟢 1. GET: सारी पोस्ट्स को लोकल सर्वर से मंगाना (डैशबोर्ड और होमपेज के लिए)
export async function GET(req) {
  try {
    const db = await getDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      // सिंगल पोस्ट मंगाना
      const post = db.posts.find(p => String(p.id) === String(id));
      if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
      
      // इस पोस्ट के कमेंट्स मंगाना और नए से पुराने के क्रम में लगाना
      const comments = db.comments
        .filter(c => String(c.post_id) === String(id))
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      
      let postCopy = { ...post };
      // Frontend Compatibility के लिए _id और createdAt सेट कर रहे हैं
      postCopy.comments = comments.map(c => ({ ...c, _id: c.id, createdAt: c.date })); 
      postCopy._id = postCopy.id; 
      postCopy.createdAt = postCopy.date;
      return NextResponse.json(postCopy);
    } else {
      // डैशबोर्ड के लिए सारी पोस्ट्स मंगाना (नए से पुराने के क्रम में)
      let posts = [...db.posts].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      
      // 🚀 MEGA UPDATE: हर पोस्ट के लिए उसके कमेंट्स ढूंढकर जोड़ना
      const formattedPosts = posts.map(post => {
        const postComments = db.comments.filter(c => String(c.post_id) === String(post.id));
        return {
          ...post,
          _id: post.id, // Frontend Compatibility के लिए
          createdAt: post.date,
          comments: postComments.map(c => ({ ...c, _id: c.id, createdAt: c.date }))
        };
      });
      
      return NextResponse.json(formattedPosts);
    }
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "डेटा लाने में सर्वर एरर" }, { status: 500 });
  }
}

// 🔵 2. POST: नई पोस्ट को लोकल सर्वर पर सेव करना (Create)
export async function POST(req) {
  try {
    const db = await getDB();
    const data = await req.json();
    
    // नया पोस्ट ऑब्जेक्ट तैयार करना (सारे पुराने फीचर्स के साथ)
    const newPost = {
      id: Date.now().toString(), // परमानेंट यूनिक ID
      title: data.title, 
      slug: data.slug, 
      category: data.category, 
      image: data.image, 
      content: data.content,
      metaTitle: data.metaTitle, 
      metaDesc: data.metaDesc, 
      keywords: data.keywords, 
      appLink: data.appLink, 
      btnText: data.btnText,
      isPinned: data.isPinned ? 1 : 0, 
      date: new Date().toISOString(), // पोस्ट कब बनी उसका समय
      createdAt: new Date().toISOString() // Frontend में एरर ना आये इसलिए यह भी डाला है
    };

    db.posts.push(newPost); // पोस्ट को लिस्ट में डाला
    await saveDB(db); // सर्वर पर परमानेंट सेव कर दिया

    return NextResponse.json({ success: true, id: newPost.id });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "पोस्ट सेव करने में एरर" }, { status: 500 });
  }
}

// 🟠 3. PUT: पुरानी पोस्ट को अपडेट (Edit) करना
export async function PUT(req) {
  try {
    const db = await getDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const data = await req.json();

    if (!id) return NextResponse.json({ error: "ID नहीं मिली" }, { status: 400 });

    const postIndex = db.posts.findIndex(p => String(p.id) === String(id));
    if (postIndex === -1) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // पुरानी पोस्ट का डेटा नए डेटा से बदल रहे हैं
    db.posts[postIndex] = {
      ...db.posts[postIndex],
      title: data.title, 
      slug: data.slug, 
      category: data.category, 
      image: data.image, 
      content: data.content,
      metaTitle: data.metaTitle, 
      metaDesc: data.metaDesc, 
      keywords: data.keywords, 
      appLink: data.appLink, 
      btnText: data.btnText,
      isPinned: data.isPinned ? 1 : 0
    };

    await saveDB(db); // अपडेटेड डेटा सर्वर पर सेव कर दिया
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "अपडेट करने में एरर" }, { status: 500 });
  }
}

// 🔴 4. DELETE: पोस्ट या कमेंट को डिलीट करना
export async function DELETE(req) {
  try {
    const db = await getDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const action = url.searchParams.get("action");
    const commentId = url.searchParams.get("commentId");

    if (action === "deleteComment" && commentId) {
      // कमेंट डिलीट करना
      db.comments = db.comments.filter(c => String(c.id) !== String(commentId));
      await saveDB(db);
      return NextResponse.json({ success: true, message: "Comment deleted" });
    }

    if (id) {
      // पोस्ट डिलीट करना और उस पोस्ट के कमेंट्स भी डिलीट करना
      db.posts = db.posts.filter(p => String(p.id) !== String(id));
      db.comments = db.comments.filter(c => String(c.post_id) !== String(id));
      await saveDB(db);
      return NextResponse.json({ success: true, message: "Post deleted" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "डिलीट करने में एरर" }, { status: 500 });
  }
}