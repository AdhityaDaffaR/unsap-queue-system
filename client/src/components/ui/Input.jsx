export default function Input({ icon: Icon, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'border-border-default focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
    error: 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20',
  };

  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <span className="absolute left-3.5 text-text-muted pointer-events-none z-10 flex items-center justify-center">
          <Icon size={16} />
        </span>
      )}
      <input 
        {...props}
        className={`w-full h-10 text-caption bg-bg-surface border rounded-[--radius-sm] transition-all duration-150 outline-none font-medium placeholder:text-text-muted/50 text-text-main ${
          Icon ? 'pl-10 pr-4' : 'px-3.5'
        } ${variants[variant]} ${className}`}
      />
    </div>
  );
}
