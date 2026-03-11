import fs from "fs/promises";
import path from "path";

// 📂 डेटाबेस फाइल का रास्ता (यह आपकी होस्टिंग के सर्वर पर है)
const dbPath = path.join(process.cwd(), "database.json");

// 🛠️ हेल्पर फंक्शन: डेटाबेस फाइल को पढ़ने के लिए
async function getDB() {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    return { posts: [], comments: [] };
  }
}

export default async function sitemap() {
  const baseUrl = "https://internetskill.in";

  // 1. तुम्हारे मेन पेज (Home, About, Contact etc.)
  const routes = ["", "/about", "/contact", "/privacy-policy", "/disclaimer"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    // 🚀 JSON फाइल (होस्टिंग) से डेटा लाना
    const db = await getDB();
    
    // 2. तुम्हारी सारी पोस्ट्स लाना
    const posts = db.posts || [];
    
    const postUrls = posts.map((post) => ({
      // 🚀 फिक्स: SEO के लिए Slug (या ID) का इस्तेमाल
      url: `${baseUrl}/post/${post.slug || post.id}`,
      lastModified: new Date(post.createdAt || post.date || Date.now()), // Date को सही फॉर्मेट में सेट करना
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    return [...routes, ...postUrls];
  } catch (error) {
    console.error("Sitemap Error:", error);
    return routes; 
  }
}