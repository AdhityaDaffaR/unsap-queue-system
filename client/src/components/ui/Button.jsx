import React from 'react';

export default function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }) {
  // Transisi hanya diterapkan pada opacity dan shadow, BUKAN pada warna global
  const baseStyle = "w-full h-10 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 select-none transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm border border-transparent",
    secondary: "bg-bg-surface border border-border-default text-text-main hover:bg-bg-muted-box"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}