'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Icons for light and dark themes

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Ensure that the component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent rendering until mounted to avoid mismatches
  }

  return (
    <div className="flex items-center">
      <button
        className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 transition-colors duration-300 focus:outline-none"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <FaMoon className="text-yellow-500" size={20} /> // Moon icon for dark mode
        ) : (
          <FaSun className="text-yellow-300" size={20} /> // Sun icon for light mode
        )}
      </button>
    </div>
  );
};
