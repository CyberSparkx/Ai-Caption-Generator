import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Paperclip, Plus, Send } from "lucide-react";
import axios from "axios";

const MIN_HEIGHT = 78;
const MAX_HEIGHT = 164;

function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(
    (reset) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const AnimatedPlaceholder = ({ showSearch }) => (
  <AnimatePresence mode="wait">
    <motion.p
      key={showSearch ? "search" : "ask"}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.1 }}
      className="pointer-events-none w-[180px] text-sm absolute text-black/70 dark:text-white/70"
    >
      {showSearch ? "What Kind of Caption You Want ..." : "Ask Morgan Ai..."}
    </motion.p>
  </AnimatePresence>
);

export function AiInput() {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });
  const [showSearch, setShowSearch] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!fileInputRef.current || !fileInputRef.current.files[0] || !value.trim()) {
      return; // Do not submit if there's no file or prompt
    }
  
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append("image", file);           // Image file
    formData.append("prompt", value);         // Caption prompt
  
    try {
      const response = await axios.post("http://localhost:3000/api/caption-generator", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Success:", response.data);
      setValue("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      adjustHeight(true);
  
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };
  
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="w-full py-4 fixed bottom-3">
      <div className="relative   w-[90vw] lg:w-[45vw] mx-auto border border-black/5 rounded-[22px] p-1">
        <div className="bg-[#e5e5e5] dark:bg-zinc-800 rounded-2xl flex flex-col ">
          {/* Textarea Section */}
          <div className="relative px-4 pt-3">
            <textarea
              value={value}
              placeholder=""
              className="w-full bg-transparent border-none resize-none text-sm text-black dark:text-white placeholder:text-black/60 dark:placeholder:text-white/60 leading-[1.2] focus:outline-none"
              ref={textareaRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
            />
            {!value && (
              <div className="absolute top-3 left-4">
                <AnimatedPlaceholder showSearch={showSearch} />
              </div>
            )}
          </div>

          {/* Controls Section (No gap above!) */}
          <div className="h-12 px-3 bg-black/5 dark:bg-white/5 flex items-center justify-between rounded-b-2xl">
            <div className="flex items-center gap-2">
              {/* Attach Button */}
              <label
                className={`cursor-pointer relative rounded-full p-2 ${
                  imagePreview
                    ? "bg-[#ff3f17]/15 border border-[#ff3f17] text-[#ff3f17]"
                    : "bg-black/10 dark:bg-white/10 text-black/40 dark:text-white/40"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                />
                <Paperclip className="w-4 h-4" />
                {imagePreview && (
                  <div className="absolute w-[100px] z-[50] h-[100px] bottom-35 -left-3 ">
                    <img
                      className="object-cover rounded-2xl w-full h-full"
                      src={imagePreview}
                      alt="preview"
                    />
                    <button
                      onClick={handleClose}
                      className="bg-[#e8e8e8] text-[#464646] absolute -top-1 -left-1 shadow-3xl rounded-full rotate-45"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </label>

              {/* Search Toggle Button */}
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className={`rounded-full transition-all flex items-center gap-2 px-2 py-1 border h-8 ${
                  showSearch
                    ? "bg-[#ff3f17]/15 border-[#ff3f17] text-[#ff3f17]"
                    : "bg-black/10 dark:bg-white/10 border-transparent text-black/40 dark:text-white/40"
                }`}
              >
                <motion.div
                  animate={{
                    rotate: showSearch ? 180 : 0,
                    scale: showSearch ? 1.1 : 1,
                  }}
                  whileHover={{
                    rotate: showSearch ? 180 : 15,
                    scale: 1.1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                  }}
                >
                  <Globe className="w-4 h-4" />
                </motion.div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm whitespace-nowrap"
                    >
                      Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className={`rounded-full p-2 transition-colors ${
                value
                  ? "bg-[#ff3f17]/15 text-[#ff3f17]"
                  : "bg-black/10 dark:bg-white/10 text-black/40 dark:text-white/40"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
