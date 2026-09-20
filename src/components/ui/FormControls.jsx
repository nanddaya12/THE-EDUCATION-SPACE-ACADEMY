import React from 'react';

export const FormInput = ({ label, error, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>}
    <input
      {...props}
      className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none font-medium transition-all ${
        error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary'
      }`}
    />
    {error && <span className="text-[11px] font-semibold text-rose-600 block">{error}</span>}
  </div>
);

export const FormSelect = ({ label, options = [], error, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>}
    <select
      {...props}
      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium bg-white"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <span className="text-[11px] font-semibold text-rose-600 block">{error}</span>}
  </div>
);

export const FormTextarea = ({ label, error, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>}
    <textarea
      {...props}
      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium"
    />
    {error && <span className="text-[11px] font-semibold text-rose-600 block">{error}</span>}
  </div>
);
