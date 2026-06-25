export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-bg-surface border border-border-default rounded-[--radius-md] shadow-[--shadow-card] ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`flex items-center gap-3 mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-h4 text-text-main ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`flex items-center gap-3 mt-4 pt-4 border-t border-border-default ${className}`}>{children}</div>;
}
