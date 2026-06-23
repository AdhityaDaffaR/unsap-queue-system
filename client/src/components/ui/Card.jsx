export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-bg-surface border border-border-default rounded-xl relative overflow-hidden shadow-sm ${className}`}>
      {children}
    </div>
  );
}