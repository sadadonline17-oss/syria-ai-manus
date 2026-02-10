import React from 'react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Chat', href: '#' },
        { label: 'Search', href: '#' },
        { label: 'Analyze', href: '#' },
        { label: 'Personalize', href: '#' },
        { label: 'Automation', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Changelog', href: '#' },
        { label: 'API Reference', href: '#' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Twitter / X', href: '#' },
        { label: 'Discord', href: '#' },
        { label: 'GitHub', href: '#' },
        { label: 'LinkedIn', href: '#' },
      ],
    },
    {
      title: 'Compare',
      links: [
        { label: 'vs ChatGPT', href: '#' },
        { label: 'vs Claude', href: '#' },
        { label: 'vs Perplexity', href: '#' },
        { label: 'vs Gemini', href: '#' },
      ],
    },
    {
      title: 'Download',
      links: [
        { label: 'iOS App', href: '#' },
        { label: 'Android App', href: '#' },
        { label: 'macOS Desktop', href: '#' },
        { label: 'Windows Desktop', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#F3F3F3] border-t border-[rgba(0,0,0,0.08)] py-20 mt-20">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="flex flex-col gap-12">
          {/* Main Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h3 className="text-[14px] font-semibold text-[#1A1A1A] leading-5">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] text-[#666666] hover:text-[#1A1A1A] transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Branding & Legal */}
          <div className="pt-8 border-t border-[rgba(0,0,0,0.08)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1.5 grayscale opacity-80">
                <svg height="24" width="18" viewBox="0 0 24.42 32">
                  <path d="M12.21 0L0 7v18l12.21 7 12.21-7V7L12.21 0z" fill="#000" />
                </svg>
                <span className="font-serif text-[18px] tracking-tight font-medium text-[#1A1A1A]">
                  manus
                </span>
              </div>
              <p className="text-[12px] text-[#8E8E8E]">
                © {new Date().getFullYear()} Manus. All rights reserved. 
                <span className="mx-2">·</span>
                Part of Meta
              </p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-[12px] text-[#8E8E8E] hover:text-[#1A1A1A] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[12px] text-[#8E8E8E] hover:text-[#1A1A1A] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-[12px] text-[#8E8E8E] hover:text-[#1A1A1A] transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;