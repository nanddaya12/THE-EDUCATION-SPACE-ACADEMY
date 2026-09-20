import React from 'react';

export const LogoEmblem = ({ className = "w-10 h-10", animated = false }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'transition-transform duration-300 group-hover:scale-105' : ''}`}
      aria-label="The Education Space Emblem"
    >
      {/* Mortarboard Cap */}
      <polygon points="100,18 182,48 100,76 18,48" fill="#0f172a" />
      <path d="M52,58 L52,86 C52,102 148,102 148,86 L148,58" fill="#0f172a" />
      {/* Tassel */}
      <path d="M174,50 L178,84 L171,90 L180,90 L174,84" stroke="#d66b3d" strokeWidth="2.5" fill="#d66b3d" />
      <circle cx="100" cy="46" r="3.5" fill="#d66b3d" />

      {/* Outer Grey Crescent Swoop */}
      <path 
        d="M44,78 C23,106 26,146 58,174 C78,190 114,192 144,177 C118,187 84,182 66,164 C40,137 40,102 60,82 Z" 
        fill="#94a3b8" 
      />

      {/* Inner Dark Crescent Swoop */}
      <path 
        d="M58,86 C37,113 41,152 74,172 C107,190 150,177 169,142 C146,167 106,174 78,157 C51,140 47,109 68,88 Z" 
        fill="#0f172a" 
      />

      {/* Center 4-Point Star Sparkle */}
      <path 
        d="M100,68 Q100,75 95,76 Q100,77 100,84 Q100,77 105,76 Q100,75 100,68 Z" 
        fill="#64748b" 
      />

      {/* Left Student Figure (Brand Orange) */}
      <polygon points="77,77 91,83 77,89 64,83" fill="#d66b3d" />
      <circle cx="77" cy="95" r="7.5" fill="#d66b3d" />
      <path 
        d="M77,103 C69,105 59,115 56,128 C63,124 71,118 75,112 C73,128 71,148 56,165 C67,152 75,136 81,122 C83,136 85,150 87,160 C88,145 87,130 86,118 C91,112 95,98 97,82 C92,92 87,100 79,104 Z" 
        fill="#d66b3d" 
      />

      {/* Right Student Figure (Charcoal Navy) */}
      <polygon points="123,77 136,83 123,89 109,83" fill="#0f172a" />
      <circle cx="123" cy="95" r="7.5" fill="#0f172a" />
      <path 
        d="M123,103 C131,105 141,115 144,128 C137,124 129,118 125,112 C127,128 129,148 144,165 C133,152 125,136 119,122 C117,136 115,150 113,160 C112,145 113,130 114,118 C109,112 105,98 103,82 C108,92 113,100 121,104 Z" 
        fill="#0f172a" 
      />
    </svg>
  );
};

export const Logo = ({ 
  size = "md", 
  showText = true, 
  subtitle = "ENTERPRISE ERP",
  variant = "dark",
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const titleSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl"
  };

  const subtitleSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-[11px]",
    xl: "text-xs"
  };

  const isLight = variant === "light";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem Icon Container with refined shadow and brand styling */}
      <div className={`${sizeClasses[size] || "w-10 h-10"} rounded-2xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200/80 shrink-0 group-hover:scale-105 transition-transform duration-200`}>
        <LogoEmblem className="w-full h-full object-contain" />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-extrabold tracking-tight block ${titleSizes[size] || "text-lg"} ${isLight ? "text-white" : "text-slate-900"}`}>
              THE EDUCATION <span className="text-primary">SPACE</span>
            </span>
          </div>

          {subtitle && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-[1.5px] bg-primary/70 rounded-full" />
              <span className={`font-bold tracking-widest uppercase block text-primary ${subtitleSizes[size] || "text-[10px]"}`}>
                {subtitle}
              </span>
              <span className="w-2.5 h-[1.5px] bg-primary/70 rounded-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
