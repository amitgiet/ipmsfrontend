import React, { useEffect, useState, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { apiCall } from "@/services/apiCall";

const QuillEditor = ({ text, setText, limit, placeholder = "Enter text..." }) => {
  const [charCount, setCharCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Helper function to extract text content from HTML
  const getTextContent = (html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // Helper function to get text length
  const getTextContentLength = (html) => {
    return getTextContent(html).length;
  };

  // Update character count
  const updateCharCount = (content) => {
    const count = getTextContentLength(content);
    setCharCount(count);
    setIsLimitReached(count >= limit);
    return count;
  };

  // Initialize character count
  useEffect(() => {
    if (text) {
      updateCharCount(text);
    }
  }, [text, limit]);

  // Handle content changes with limit enforcement
  const handleChange = (content) => {
    if (!limit) {
      setText(content);
      updateCharCount(content);
      return;
    }

    const currentLength = getTextContentLength(content);

    if (currentLength > limit) {
      // Prevent the change if it exceeds the limit
      toast.warn(`Character limit of ${limit} reached`);
      return;
    }

    setText(content);
    updateCharCount(content);
  };

  // Custom image handler
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      // Check file size (optional - 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const toastId = toast.loading("Uploading image...");
        
        const response = await apiCall("/ckeditor-image-upload", "post", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.success && response.data?.url) {
          toast.update(toastId, {
            render: "✅ Image uploaded successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
          });

          // Insert image into editor
          const quill = document.querySelector(".ql-editor").__quill;
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", response.data.url);
          quill.setSelection(range.index + 1);
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        toast.error("Image upload failed");
        console.error("Upload error:", error);
      }
    };
  };

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
  }), []);

  // Quill formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="quill-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={text || ""}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          height: "230px",
          marginBottom: "50px",
        }}
      />
      {limit && (
        <div className="char-counter mt-2 text-end text-sm text-gray-600">
          <span className={charCount > limit * 0.9 ? "text-orange-500" : ""}>
            {charCount}/{limit} characters
          </span>
          {charCount > limit * 0.9 && charCount < limit && (
            <span className="text-orange-500 ml-2">(Approaching limit)</span>
          )}
          {isLimitReached && (
            <span className="text-red-500 ml-2">(Limit reached)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default QuillEditor;
