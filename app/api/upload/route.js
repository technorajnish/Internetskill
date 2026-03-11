import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary को आपकी चाबियां दे रहे हैं
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const data = await request.formData();
    const image = data.get("file");

    if (!image) {
      return NextResponse.json({ error: "कोई इमेज नहीं मिली" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // इमेज को Cloudinary पर अपलोड कर रहे हैं
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "internetskill_images" }, // इस फोल्डर में फोटो सेव होगी
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Cloudinary से मिली हुई छोटी सी Link वापस भेज रहे हैं
    return NextResponse.json({ url: result.secure_url }, { status: 200 });
    
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "अपलोड फेल हो गया" }, { status: 500 });
  }
}