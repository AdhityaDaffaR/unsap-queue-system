import React from 'react';

export default function Input({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <span className="absolute left-3.5 text-text-muted pointer-events-none">
          <Icon size={16} />
        </span>
      )}
      <input 
        {...props}
        className={`w-full py-2.5 text-sm bg-bg-main border border-border-default rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none font-medium placeholder:text-text-muted/50 text-text-main ${
          Icon ? 'pl-10 pr-4' : 'px-4'
        } ${className}`}
      />
    </div>
  );
}