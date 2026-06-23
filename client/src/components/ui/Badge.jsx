export default function Badge({ variant = 'success', children, className = '' }) {
  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    danger: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    info: 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border h-6 select-none ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}