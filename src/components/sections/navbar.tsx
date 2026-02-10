"use client";

import React from "react";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-40 w-full bg-[#F3F3F3]">
      {/* Mobile Navbar */}
      <div className="hidden relative z-40 justify-between items-center max-md:flex">
        <div className="mx-auto max-w-[1080px] w-full flex items-center justify-between py-3 px-6">
          <a href="/?index=1" className="w-fit">
            <div className="flex items-center gap-0.5 w-fit">
              {/* Manus Logo Placeholder - Simple SVG representation of the hand logo */}
              <div className="flex items-center">
                <svg
                  height="32"
                  viewBox="0 0 24 32"
                  width="24.42105263157895"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C10.9 2 10 2.9 10 4V16.38L7.91 14.12C7.54 13.72 6.89 13.7 6.47 14.07C6.06 14.44 6.04 15.09 6.4 15.5L10.67 20.12C11.5 21.03 12.63 21.5 13.79 21.5H18C19.1 21.5 20 20.6 20 19.5V7C20 5.9 19.1 5 18 5C17.72 5 17.5 5.22 17.5 5.5V11H16.5V3C16.5 1.9 15.6 1 14.5 1C13.4 1 12.5 1.9 12.5 3V11H12V2Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="ml-1 text-[18px] font-semibold tracking-tight">manus</span>
              </div>
            </div>
          </a>
          <div className="flex gap-3 items-center">
            <div className="flex gap-2 items-center">
              <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors hover:opacity-90 active:opacity-80 bg-[#000000] text-[#FFFFFF] h-[32px] min-w-[64px] px-[8px] rounded-[8px] gap-[4px] text-[14px] leading-[18px]">
                Sign in
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors hover:opacity-90 active:opacity-80 h-[32px] min-w-[64px] px-[8px] rounded-[8px] gap-[4px] text-[14px] leading-[18px] outline outline-1 -outline-offset-1 hover:bg-[rgba(255,255,255,0.5)] text-[#1A1A1A] outline-[rgba(0,0,0,0.08)] bg-transparent">
                Sign up
              </button>
            </div>
            <Menu className="w-6 h-6 clickable cursor-pointer text-[#1A1A1A]" />
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <header className="w-full h-[56px] relative z-20 max-md:hidden backdrop-blur-sm bg-[#F3F3F3]/80 border-b border-black/[0.04]">
        <div className="mx-auto max-w-[1080px] h-full py-3 px-6 grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center">
          <a className="w-fit" href="/?index=1">
            <div className="flex items-center gap-0.5 w-fit">
              <div className="flex items-center">
                <svg
                  height="28"
                  viewBox="0 0 24 32"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-black"
                >
                  <path
                    d="M12 2C10.9 2 10 2.9 10 4V16.38L7.91 14.12C7.54 13.72 6.89 13.7 6.47 14.07C6.06 14.44 6.04 15.09 6.4 15.5L10.67 20.12C11.5 21.03 12.63 21.5 13.79 21.5H18C19.1 21.5 20 20.6 20 19.5V7C20 5.9 19.1 5 18 5C17.72 5 17.5 5.22 17.5 5.5V11H16.5V3C16.5 1.9 15.6 1 14.5 1C13.4 1 12.5 1.9 12.5 3V11H12V2Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="ml-1 text-[18px] font-bold tracking-tight text-[#1A1A1A]">manus</span>
              </div>
            </div>
          </a>

          <div className="justify-self-center hidden md:flex items-center gap-2 text-[#666666] text-sm font-[500]">
            <div className="px-3 py-1.5 rounded-[8px] hover:bg-[rgba(0,0,0,0.04)] cursor-pointer transition-colors">
              Features
            </div>
            <div className="px-3 py-1.5 rounded-[8px] hover:bg-[rgba(0,0,0,0.04)] cursor-pointer transition-colors">
              Resources
            </div>
            <a href="https://events.manus.im">
              <div className="px-3 py-1.5 rounded-[8px] hover:bg-[rgba(0,0,0,0.04)] cursor-pointer transition-colors">
                Events
              </div>
            </a>
            <a href="/pricing">
              <div className="px-3 py-1.5 rounded-[8px] hover:bg-[rgba(0,0,0,0.04)] cursor-pointer transition-colors">
                Pricing
              </div>
            </a>
          </div>

          <div className="justify-self-end hidden md:flex items-center gap-2">
            <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors hover:opacity-90 active:opacity-80 bg-[#000000] text-[#FFFFFF] h-[32px] min-w-[64px] px-[8px] rounded-[8px] gap-[4px] text-[14px] leading-[18px]">
              Sign in
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors hover:opacity-90 active:opacity-80 h-[32px] min-w-[64px] px-[8px] rounded-[8px] gap-[4px] text-[14px] leading-[18px] outline outline-1 -outline-offset-1 hover:bg-[rgba(255,255,255,0.5)] text-[#1A1A1A] outline-[rgba(0,0,0,0.08)] bg-transparent">
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Announcement Bar */}
      <div className="w-full bg-[rgba(255,255,255,0.5)] flex items-center justify-center px-[24px] py-[12px] border-b border-black/[0.04]">
        <a
          href="/blog/manus-joins-meta-for-next-era-of-innovation"
          className="flex items-center gap-[4px] shrink-0 max-md:gap-[8px] hover:opacity-80 transition-opacity duration-300"
        >
          <p className="text-[14px] md:text-[16px] font-[500] leading-[20px] text-[#1A1A1A] text-center">
            Manus is now part of Meta
          </p>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-right ml-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Navbar;