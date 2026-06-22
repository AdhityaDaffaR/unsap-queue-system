import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
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