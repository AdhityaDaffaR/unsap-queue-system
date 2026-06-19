import React from 'react';

export default function Badge({ variant = 'success', children, className = '' }) {
  // PERBAIKAN: Pemetaan gaya murni membaca token global dari index.css
  const styles = {
    success: 'bg-badge-success-bg border-badge-success-border text-success',
    danger: 'bg-badge-danger-bg border-badge-danger-border text-danger',
    warning: 'bg-badge-warning-bg border-badge-warning-border text-warning',
    info: 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}