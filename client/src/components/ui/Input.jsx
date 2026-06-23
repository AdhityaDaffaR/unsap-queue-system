export default function Input({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <span className="absolute left-3.5 text-text-muted pointer-events-none z-10 flex items-center justify-center">
          <Icon size={16} />
        </span>
      )}
      <input 
        {...props}
        className={`w-full h-10 text-sm bg-bg-surface border border-border-default rounded-md focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-shadow outline-none font-medium placeholder:text-text-muted/50 text-text-main ${
          Icon ? 'pl-10 pr-4' : 'px-3.5'
        } ${className}`}
      />
    </div>
  );
}