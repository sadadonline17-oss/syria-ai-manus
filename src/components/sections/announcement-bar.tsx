import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * AnnouncementBar component
 * Cloned to match the Manus website announcement bar.
 * Text: "Manus is now part of Meta"
 * Styling: Light semi-transparent background, centered content, arrow icon.
 */
const AnnouncementBar = () => {
  return (
    <div className="w-full bg-[rgba(255,255,255,0.5)] flex items-center justify-center px-6 py-3">
      <a 
        href="/blog/manus-joins-meta-for-next-era-of-innovation" 
        className="flex items-center gap-1 shrink-0 transition-opacity duration-300 hover:opacity-80 cursor-pointer md:gap-2"
      >
        <p className="text-[16px] font-500 leading-5 text-[#1A1A1A] text-center">
          Manus is now part of Meta
        </p>
        <ArrowRight 
          size={16} 
          className="text-[#1A1A1A]" 
          strokeWidth={2}
        />
      </a>
    </div>
  );
};

export default AnnouncementBar;