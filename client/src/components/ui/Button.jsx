import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = '' }) {
  const baseStyle = "w-full py-2.5 rounded-lg font-medium text-sm transition-all active:scale-[0.98] cursor-pointer text-center block";
  
  const variants = {
    // Tombol Utama (Solid Blue) - Konsisten di kedua mode
    primary: "bg-brand-primary hover:bg-brand-primary-hover text-white shadow-sm",
    
    // PERBAIKAN TOMBOL SEKUNDER: Hover state yang cerdas & adaptif mengikuti tema
    secondary: "bg-transparent border border-border-default text-text-main hover:bg-bg-muted-box hover:text-brand-primary hover:border-brand-primary/30 dark:hover:text-text-main"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}