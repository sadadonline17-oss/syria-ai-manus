import React from 'react';
import { Smartphone } from 'lucide-react';

/**
 * QuickActions component
 * 
 * Renders a row of pill-shaped action chips (chips/tags) below the chat box.
 * Matches the pixel-perfect styling from the Manus UI design system.
 */

interface QuickActionChipProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const QuickActionChip: React.FC<QuickActionChipProps> = ({ icon, label, onClick }) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className="h-10 px-[14px] py-[7px] rounded-full border border-[rgba(0,0,0,0.08)] flex justify-center items-center gap-2 cursor-pointer transition-all duration-300 hover:bg-[rgba(255,255,255,0.5)] active:scale-[0.98] active:opacity-80 flex-shrink-0"
    >
      {icon && <div className="text-[var(--text-primary)]">{icon}</div>}
      <div className="flex justify-start items-center gap-1">
        <span className="text-[#1A1A1A] text-[14px] font-normal leading-[18px]">
          {label}
        </span>
      </div>
    </div>
  );
};

const QuickActions: React.FC = () => {
  // Custom SVG Icons matched to the design
  const SlidesIcon = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.75 4.5H2.25V13.5H15.75V4.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.25 7.5H12.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.25 10.5H9.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const WebsiteIcon = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3H3C2.44772 3 2 3.44772 2 4V14C2 14.5523 2.44772 15 3 15H15C15.5523 15 16 14.5523 16 14V4C16 3.44772 15.5523 3 15 3Z" />
        <path d="M2 7H16" />
        <path d="M5 5H5.01" />
        <path d="M7.5 5H7.51" />
      </g>
    </svg>
  );

  const DesignIcon = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 2.25V4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.75 9H13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 15.75V13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.25 9H4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.77 4.23L12.18 5.82" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.77 13.77L12.18 12.18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.23 13.77L5.82 12.18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.23 4.23L5.82 5.82" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="relative w-full">
      <div className="w-full transition-transform duration-300 ease-out opacity-100 translate-y-0 scale-100 relative mt-[20px]">
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <div className="flex flex-wrap justify-center items-center gap-2">
            <QuickActionChip 
              icon={SlidesIcon} 
              label="Create slides" 
              onClick={() => console.log('Create slides clicked')}
            />
            <QuickActionChip 
              icon={WebsiteIcon} 
              label="Build website" 
              onClick={() => console.log('Build website clicked')}
            />
            <QuickActionChip 
              icon={<Smartphone width={18} height={18} className="lucide lucide-smartphone" />} 
              label="Develop apps" 
              onClick={() => console.log('Develop apps clicked')}
            />
            <QuickActionChip 
              icon={DesignIcon} 
              label="Design" 
              onClick={() => console.log('Design clicked')}
            />
            <div 
              role="button"
              className="h-10 px-[14px] text-[14px] py-[7px] rounded-full border border-[rgba(0,0,0,0.08)] flex justify-center items-center gap-2 cursor-pointer transition-all duration-300 hover:bg-[rgba(255,255,255,0.5)] active:scale-[0.98] active:opacity-80 text-[#1A1A1A] font-normal"
              onClick={() => console.log('More clicked')}
            >
              More
            </div>
          </div>
        </div>
      </div>
      {/* Subtle bottom space to match layout */}
      <div className="w-full transition-transform duration-300 ease-out opacity-0 translate-y-[8px] scale-[0.98] absolute top-0 left-0 pointer-events-none mt-[24px]">
        <div className="w-full px-3 rounded-[22px] flex flex-col justify-center items-center"></div>
      </div>
    </div>
  );
};

export default QuickActions;