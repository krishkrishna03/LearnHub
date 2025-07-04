// Configuration management for the application
export interface AppConfig {
  apiUrl: string;
  frontendUrl: string;
  youtubeResources: YoutubeResource[];
}

export interface YoutubeResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnail?: string;
  duration?: string;
  isActive: boolean;
  createdAt: string;
}

// Default configuration
const defaultConfig: AppConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  youtubeResources: []
};

// Configuration storage key
const CONFIG_STORAGE_KEY = 'learnhub_config';

// Get configuration from localStorage or use defaults
export const getConfig = (): AppConfig => {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      const parsedConfig = JSON.parse(stored);
      return { ...defaultConfig, ...parsedConfig };
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  return defaultConfig;
};

// Save configuration to localStorage
export const saveConfig = (config: AppConfig): void => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving config:', error);
  }
};

// Update specific config values
export const updateConfig = (updates: Partial<AppConfig>): AppConfig => {
  const currentConfig = getConfig();
  const newConfig = { ...currentConfig, ...updates };
  saveConfig(newConfig);
  return newConfig;
};