"use client";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// एडिटर के एडवांस टूल्स
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

export default function Editor({ value, onChange }) {
  return (
    <div className="bg-white text-black rounded-2xl overflow-hidden border-2 border-slate-700">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules}
        className="h-[400px] pb-12" 
      />
    </div>
  );
}