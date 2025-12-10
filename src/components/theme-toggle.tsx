import React from 'react';
import { Icon, Box } from 'zmp-ui';
import { useTheme } from '../contexts/theme-context';

export const ThemeToggle: React.FC = () => {
  const { effectiveTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {effectiveTheme === 'light' ? (
        <Icon icon="zi-moon" size={24} className="text-gray-700" />
      ) : (
        <Icon icon="zi-sun" size={24} className="text-yellow-400" />
      )}
    </button>
  );
};
