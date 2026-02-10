"use client";

import React, { useState } from "react";
import { 
  ArrowUp, 
  Smartphone, 
  Presentation, 
  Globe, 
  Palette,
  Plus
} from "lucide-react";

/**
 * HeroChat Section
 * Features the serif headline "What can I do for you?" and the central interactive AI chat input.
 * Built with Next.js 15, TypeScript, and Tailwind CSS.
 */
export default function HeroChat() {
  const [inputValue, setInputValue] = useState("");

  const suggestionTags = [
    { icon: <Presentation size={18} />, label: "Create slides" },
    { icon: <Globe size={18} />, label: "Build website" },
    { icon: <Smartphone size={18} />, label: "Develop apps" },
    { icon: <Palette size={18} />, label: "Design" },
  ];

  return (
    <section className="relative w-full flex flex-col items-center px-4 sm:px-6">
      {/* Hero Title Container */}
      <div className="mt-[20vh] mb-[40px] text-center w-full max-w-[1080px]">
        <h1 className="text-[var(--text-primary)] font-serif text-[36px] leading-[1.2] font-normal">
          What can I do for you?
        </h1>
      </div>

      {/* Main Chat Input Container */}
      <div className="w-full max-w-[768px] sm:min-w-[390px] flex flex-col gap-1">
        <div className="relative w-full">
          <div className="flex flex-col gap-3 rounded-[22px] transition-all relative bg-white py-3 min-h-[140px] max-h-[300px] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.08)] focus-within:border-[rgba(0,0,0,0.2)]">
            
            {/* Input Text Area Simulation */}
            <div className="flex-1 overflow-auto ps-4 pe-4 min-h-[46px] w-full">
              <textarea
                className="w-full h-full bg-transparent border-none outline-none resize-none text-[15px] leading-[24px] text-[var(--text-primary)] placeholder:text-[var(--muted-foreground)]"
                placeholder="Assign a task or ask anything"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={2}
              />
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between px-3 mt-auto">
              {/* File Upload / Plus Button */}
              <button 
                type="button" 
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[rgba(0,0,0,0.08)] text-[var(--text-secondary)] hover:bg-[rgba(0,0,0,0.04)] transition-colors interactive-press"
              >
                <Plus size={18} />
              </button>

              {/* Send Button */}
              <button 
                type="button"
                disabled={!inputValue.trim()}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                  inputValue.trim() 
                    ? "bg-black text-white hover:opacity-90 active:scale-95" 
                    : "bg-[rgba(0,0,0,0.04)] text-[rgba(0,0,0,0.2)] cursor-not-allowed"
                }`}
              >
                <ArrowUp size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion Tags Row */}
        <div className="mt-5 w-full">
          <div className="flex flex-wrap justify-center items-center gap-2">
            {suggestionTags.map((tag, index) => (
              <button
                key={index}
                className="h-10 px-[14px] py-[7px] rounded-full border border-[rgba(0,0,0,0.08)] flex justify-center items-center gap-2 glass-hover bg-[rgba(255,255,255,0.3)] transition-colors clickable flex-shrink-0"
              >
                <span className="text-[var(--text-secondary)]">{tag.icon}</span>
                <span className="text-[var(--text-primary)] text-[14px] font-normal">
                  {tag.label}
                </span>
              </button>
            ))}
            <button className="h-10 px-[14px] py-[7px] rounded-full border border-[rgba(0,0,0,0.08)] flex justify-center items-center text-sm font-normal text-[var(--text-primary)] glass-hover bg-[rgba(255,255,255,0.3)] transition-colors clickable">
              More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}