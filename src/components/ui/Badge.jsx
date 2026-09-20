import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md' }) => {
  const variantStyles = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    info: 'bg-sky-100 text-sky-800 border-sky-200',
    primary: 'bg-primary/10 text-primary border-primary/20',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs font-bold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full border ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
};
