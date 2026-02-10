import React from 'react';
import Image from 'next/image';

const features = [
  {
    title: 'Custom Web Tool',
    description: 'Create a specialized online tool, such as a custom calculator or unit converter.',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/c8b332af6cc3b3aa30e1b4e0517722003f6c2f174b45d648d4061eefa75e4ae5.webp',
  },
  {
    title: 'Localize Content',
    description: 'Adapt your content for new markets with cultural and linguistic localization.',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/a24da9913ab619feb9ff160c095b4830a21b7e95c46237b3b9-2.webp',
  },
  {
    title: 'Clean Data Output',
    description: 'Clean and structure your raw data into a polished, ready-to-use, and export-ready format.',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/cc764634f0dffceddb47a83121c8cee6ac2032cb4da7f78ebf-3.webp',
  },
  {
    title: 'Automated Reminders',
    description: 'Set up automated meeting reminders from your Google Calendar to never miss an important event.',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/a954b2e9c5231aead9d482641c37c3d1367f7657778adf4572-4.webp',
  },
  {
    title: 'Career Document Crafter',
    description: 'Craft a compelling resume, CV, or cover letter to land your dream job.',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/a63fbeca9d57651bfc8beb3f8e5215d993b1e75d2ce9c8fda5-5.webp',
  },
  {
    title: 'Professional Headshot',
    description: 'Generate a professional headshot for your profile picture, avatar, or team photo.',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/f5560a41fa82bd29e5cfbcd91437d65525959ceaad49b14a9a-6.webp',
  },
  {
    title: 'Design a Project Proposal Pitch Deck',
    description: 'Generate a compelling pitch deck to present a new project proposal.',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/cce09837c7b09d74b47c8c24e2c697caf25159b4e9da07f11b-7.webp',
  },
  {
    title: 'Craft Professional Emails',
    description: 'Your assistant for drafting formal, well-structured business and professional emails for any occasion.',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/b186df39c0f8fd7c9e66db0a22255f7c2c8a1d2debe5cfe541-8.webp',
  },
  {
    title: 'Export to Table',
    description: 'Extracts key information from your documents and organizes it into a structured table format.',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/15a1a5a9573688587c57da95664efded17d83a0ddc62de6872-9.webp',
  },
  {
    title: 'Build Personal Website',
    description: 'Create a professional personal website to showcase your portfolio and build your brand.',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/51b53d3c3d734802f062a60022a459e19ddf4e12d2bcfef8b0-10.webp',
  },
];

const FeatureGrid = () => {
  return (
    <section className="mt-40 mb-20 px-4 md:px-0">
      <div className="mx-auto max-w-[768px]">
        <h2 className="text-[var(--text-primary)] text-base font-[500] leading-[22px] truncate">
          What are you building?
        </h2>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group clickable flex items-center overflow-clip rounded-[12px] border border-[var(--border-main)] hover:bg-[rgba(255,255,255,0.5)] transition-colors duration-300"
              role="button"
            >
              <div className="flex-1 p-[16px] min-w-0">
                <p className="text-[14px] leading-[20px] text-[var(--text-primary)] font-[500] truncate">
                  {feature.title}
                </p>
                <div className="mt-[4px] text-[13px] leading-[18px] text-[var(--text-tertiary)] line-clamp-3">
                  {feature.description}
                </div>
              </div>
              <div className="w-[108px] h-[108px] overflow-clip flex-shrink-0">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={108}
                  height={108}
                  className="w-full h-full object-contain"
                  priority={index < 4}
                />
              </div>
            </div>
          ))}
          
          {/* Edge case: Bilingual Output card as seen in content but not fully visible in first 10 assets logic */}
          <div
            className="group clickable flex items-center overflow-clip rounded-[12px] border border-[var(--border-main)] hover:bg-[rgba(255,255,255,0.5)] transition-colors duration-300"
            role="button"
          >
            <div className="flex-1 p-[16px] min-w-0">
              <p className="text-[14px] leading-[20px] text-[var(--text-primary)] font-[500] truncate">
                Bilingual Output
              </p>
              <div className="mt-[4px] text-[13px] leading-[18px] text-[var(--text-tertiary)] line-clamp-3">
                Get a side-by-side bilingual version of your text in any two languages.
              </div>
            </div>
            <div className="w-[108px] h-[108px] overflow-clip flex-shrink-0">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/688d199a-6508-44ef-a37b-24dbf6a892f2-manus-im/assets/images/4324cb532ebf6015b2321b4481511495e267b2966430694020-11.webp"
                alt="Bilingual Output"
                width={108}
                height={108}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div
            className="group clickable flex items-center overflow-clip rounded-[12px] border border-[var(--border-main)] hover:bg-[rgba(255,255,255,0.5)] transition-colors duration-300"
            role="button"
          >
            <div className="flex-1 p-[16px] min-w-0">
              <p className="text-[14px] leading-[20px] text-[var(--text-primary)] font-[500] truncate">
                Organize My Data
              </p>
              <div className="mt-[4px] text-[13px] leading-[18px] text-[var(--text-tertiary)] line-clamp-3">
                I need to structure my messy data into a clean, organized, and tabulated format.
              </div>
            </div>
            <div className="w-[108px] h-[108px] overflow-clip flex-shrink-0 flex items-center justify-center bg-[var(--fill-tsp-white-light)]">
                {/* Fallback for the last visible incomplete card in structure */}
                <div className="w-12 h-12 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;