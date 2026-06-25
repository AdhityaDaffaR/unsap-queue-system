import { forwardRef } from 'react';

const variantMap = {
  default: 'default', primary: 'default',
  destructive: 'destructive',
  outline: 'outline',
  ghost: 'ghost',
};

const variants = {
  default: 'bg-brand-primary text-white hover:brightness-110 border border-transparent',
  destructive: 'bg-danger text-white hover:brightness-110 border border-transparent',
  outline: 'bg-transparent text-text-main border border-border-default hover:bg-bg-muted-box',
  ghost: 'bg-transparent text-text-muted hover:text-text-main hover:bg-bg-main border border-transparent',
};

const sizes = {
  sm: 'h-8 px-3 text-micro gap-1.5',
  default: 'h-10 px-4 text-tiny gap-2',
  lg: 'h-12 px-6 text-caption gap-2.5',
  icon: 'h-8 w-8 p-0',
};

const Button = forwardRef(function Button(
  { children, variant = 'default', size = 'default', type = 'button', disabled = false, className = '', ...props },
  ref
) {
  const baseStyle = 'inline-flex items-center justify-center font-bold rounded-[--radius-sm] select-none transition-all duration-150 active:scale-[--active-scale] cursor-pointer disabled:opacity-50 disabled:pointer-events-none';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`${baseStyle} ${variants[variantMap[variant]] || variants.default} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
