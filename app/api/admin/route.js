import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Admin from "@/models/Admin";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// 🛠️ एक छोटा फंक्शन जो चेक करेगा कि Admin है या नहीं, नहीं तो अपने आप बना देगा
async function ensureAdmin() {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    // अगर डेटाबेस में कोई एडमिन नहीं है, तो डिफ़ॉल्ट बना दो
    await Admin.create({ username: "admin", password: "password123" });
  }
}

// 🔐 1. Login चेक करने के लिए
export async function POST(request) {
  try {
    await connectDB();
    await ensureAdmin(); // टेबल और डिफ़ॉल्ट एडमिन चेक करेगा

    const { username, password } = await request.json();
    
    // डेटाबेस से एडमिन डिटेल्स लाओ
    const adminUser = await Admin.findOne(); 

    // आईडी-पासवर्ड मैच करो
    if (adminUser && adminUser.username === username && adminUser.password === password) {
      return NextResponse.json({ message: "Login Success", success: true }, { status: 200 });
    } else {
      return NextResponse.json({ message: "गलत ID या Password ❌", success: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// ♻️ 2. नया पासवर्ड और ID सेव (Update) करने के लिए
export async function PUT(request) {
  try {
    await connectDB();
    await ensureAdmin(); // टेबल और डिफ़ॉल्ट एडमिन चेक करेगा

    const { newUsername, newPassword } = await request.json();
    
    // नया डेटा सेव (Update) करो
    const adminUser = await Admin.findOne();
    adminUser.username = newUsername;
    adminUser.password = newPassword;
    await adminUser.save();

    return NextResponse.json({ message: "Security Updated Successfully ✅", success: true }, { status: 200 });
  } catch (error) {
    console.error("Admin Update Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}