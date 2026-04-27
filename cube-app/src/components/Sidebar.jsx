import React from 'react';
import { X } from 'lucide-react';
import { colorMap } from '../utils/geometryMap';
import { hebrewCharMap } from '../utils/hebrewMap';

export default function Sidebar({ data, onClose }) {
  if (!data) return null;

  const hebrewChar = hebrewCharMap[data.hebrew_letter] || data.hebrew_letter;

  return (
    <div className="absolute top-0 right-0 h-full w-full md:w-[450px] glass-panel z-50 flex flex-col transition-all duration-500 ease-in-out transform translate-x-0 overflow-y-auto border-l border-white/5">
      <div className="p-8 relative flex flex-col h-full bg-gradient-to-b from-white/[0.02] to-transparent">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-all hover:rotate-90 duration-300 p-2 rounded-full hover:bg-white/5"
        >
          <X size={28} strokeWidth={1} />
        </button>

        <div className="flex flex-col items-center mt-10 space-y-8">
          {/* Large Hebrew Letter - Minimalist Header */}
          <div className="flex flex-col items-center">
            <div 
              className="text-[120px] leading-none hebrew-text text-center select-none" 
              style={{ 
                color: colorMap[data.bota_color] || '#ffffff',
                textShadow: `0 0 40px ${colorMap[data.bota_color]}44`
              }}
            >
              {hebrewChar}
            </div>
            <div className="text-white/30 text-xs tracking-[0.5em] uppercase font-light mt-4">
              {data.hebrew_letter}
            </div>
          </div>

          {/* Tarot Card Image - Premium Presentation */}
          <div className="relative group w-64 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden border border-white/10 aspect-[2/3.5]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
            <img 
              src={`${import.meta.env.BASE_URL}res/${data.tarot_image_filename}`} 
              alt={data.tarot_card} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Title & Description Area */}
          <div className="w-full space-y-6 text-center md:text-left px-4">
            <div className="space-y-1">
              <h2 className="text-4xl font-extralight tracking-[0.15em] text-white/90 uppercase">
                {data.tarot_card}
              </h2>
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent md:mx-0 mx-auto" />
            </div>

            {/* Meta Tags */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div className="flex flex-col space-y-1">
                <span className="text-white/20 uppercase text-[10px] tracking-[0.2em]">Celestial Attribute</span>
                <span className="text-lg font-light text-white/80">{data.attribute}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-white/20 uppercase text-[10px] tracking-[0.2em]">B.O.T.A. Color</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                    style={{ backgroundColor: colorMap[data.bota_color] || '#fff' }}
                  />
                  <span className="text-lg font-light text-white/80">{data.bota_color}</span>
                </div>
              </div>
              <div className="flex flex-col col-span-2 space-y-1">
                <span className="text-white/20 uppercase text-[10px] tracking-[0.2em]">Sacred Position</span>
                <span className="text-sm font-light text-white/60 tracking-wider">
                  {data.specific_position} — {data.position_type}
                </span>
              </div>
            </div>

            {/* Description Text */}
            <div className="bg-white/[0.03] p-6 rounded-xl border border-white/5 backdrop-blur-sm">
              <p className="text-white/60 leading-relaxed font-light text-base text-justify italic font-serif">
                "{data.description}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
