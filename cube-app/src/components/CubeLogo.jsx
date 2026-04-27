import React from 'react';

export const CubeLogo = ({ className }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Outer Hexagon (cube projection) */}
    <path d="M50 5 L90 27.5 V72.5 L50 95 L10 72.5 V27.5 Z" strokeOpacity="0.8" />
    {/* Internal Y structure */}
    <path d="M50 50 L50 95" strokeOpacity="0.8" />
    <path d="M50 50 L10 27.5" strokeOpacity="0.8" />
    <path d="M50 50 L90 27.5" strokeOpacity="0.8" />
    {/* Inner cube top edge hint */}
    <path d="M10 27.5 L50 5 L90 27.5" strokeOpacity="0.4" strokeDasharray="2 2" />

    {/* Beth (ב) — Top face */}
    <text x="50" y="30" textAnchor="middle" dominantBaseline="central"
      fill="currentColor" stroke="none" fontSize="20" fontFamily="'HebrewFont', serif" opacity="0.75">ב</text>

    {/* Kaph (כ) — Left face */}
    <text x="30" y="63" textAnchor="middle" dominantBaseline="central"
      fill="currentColor" stroke="none" fontSize="20" fontFamily="'HebrewFont', serif" opacity="0.75">כ</text>

    {/* Resh (ר) — Right face */}
    <text x="70" y="63" textAnchor="middle" dominantBaseline="central"
      fill="currentColor" stroke="none" fontSize="20" fontFamily="'HebrewFont', serif" opacity="0.75">ר</text>
  </svg>
);
