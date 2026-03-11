import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: "Home" },
  image: { type: String },
  content: { type: String, required: true },
  metaTitle: { type: String },
  metaDesc: { type: String },
  keywords: { type: String },
  appLink: { type: String },
  btnText: { type: String, default: "Download Now" },
  isPinned: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  comments: [CommentSchema]
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);