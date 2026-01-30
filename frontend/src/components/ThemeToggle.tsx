import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './ui/button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full border-0 bg-transparent hover:bg-light-3 dark:hover:bg-dark-3 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-dark-2 dark:text-white" />
      ) : (
        <Moon className="h-5 w-5 text-dark-2 dark:text-white" />
      )}
    </Button>
  );
};

export default ThemeToggle;

