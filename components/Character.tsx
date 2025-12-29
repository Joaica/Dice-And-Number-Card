
import React from 'react';

export const Character: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative ${className} select-none pointer-events-none`}>
      <svg
        viewBox="0 0 200 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]"
      >
        {/* Hair / Hood background - Cyber Purple */}
        <path
          d="M40 120C40 80 160 80 160 120V250C160 250 100 270 40 250V120Z"
          fill="#581c87"
        />
        
        {/* Face - Neutral Tech */}
        <path
          d="M50 160C50 120 150 120 150 160C150 210 130 260 100 260C70 260 50 210 50 160Z"
          fill="#f3f4f6"
        />

        {/* Eyes - Glowing Cyan */}
        <circle cx="75" cy="185" r="12" fill="white" />
        <circle cx="75" cy="185" r="7" fill="#22d3ee" />
        <circle cx="125" cy="185" r="12" fill="white" />
        <circle cx="125" cy="185" r="7" fill="#22d3ee" />

        {/* Mouth - Cyber Slit */}
        <rect x="85" y="220" width="30" height="2" rx="1" fill="#22d3ee" className="animate-pulse" />

        {/* Body / Robe - Deep Space Blue */}
        <path
          d="M60 255L35 340H165L140 255H60Z"
          fill="#0f172a"
        />
        {/* Trim line - Cyan */}
        <path
          d="M100 255V340"
          stroke="#22d3ee"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Arms - Dark */}
        <path
          d="M65 250L35 315"
          stroke="#1e293b"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M135 250L165 315"
          stroke="#1e293b"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Hat / Headpiece - Tech Black/Cyan */}
        <path
          d="M65 110L80 75H120L135 110H65Z"
          fill="#020617"
          stroke="#22d3ee"
          strokeWidth="1.5"
        />
        <circle cx="100" cy="85" r="3" fill="#a855f7" className="animate-pulse" />

        {/* Floating Matrix Star */}
        <path
          d="M175 170L178 178H187L180 183L182 191L175 186L168 191L170 183L163 178H172L175 170Z"
          fill="#22d3ee"
          className="animate-pulse"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};
