import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const next = !isDark;
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  };

  return (
    <button 
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-lg bg-transparent border border-border-default hover:bg-bg-muted-box transition-colors cursor-pointer flex items-center justify-center w-9 h-9 active:scale-[0.95]"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={16} className="text-text-main shrink-0" />
      ) : (
        <Moon size={16} className="text-text-muted shrink-0" />
      )}
    </button>
  );
}