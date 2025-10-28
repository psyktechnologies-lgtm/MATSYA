import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      name: 'light',
      icon: Sun,
      label: 'Light',
      description: 'Clean bright theme'
    },
    {
      name: 'dark',
      icon: Moon,
      label: 'Dark', 
      description: 'Easy on the eyes'
    }
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
      {themes.map((themeOption) => {
        const Icon = themeOption.icon;
        const isActive = theme === themeOption.name;
        
        return (
          <Button
            key={themeOption.name}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTheme(themeOption.name)}
            className={cn(
              'flex items-center space-x-2 transition-all duration-200',
              isActive && themeOption.name === 'light' && 'bg-background text-foreground',
              isActive && themeOption.name === 'dark' && 'bg-foreground text-background'
            )}
            title={`${themeOption.label} - ${themeOption.description}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{themeOption.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;