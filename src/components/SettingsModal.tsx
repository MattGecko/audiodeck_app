import React from 'react';
import { X } from 'lucide-react';
import type { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const handleChange = (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    onSettingsChange(newSettings);
    
    // Persist to localStorage
    Object.entries(newSettings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Grid Columns</label>
            <select
              value={settings.gridColumns}
              onChange={(e) => handleChange('gridColumns', Number(e.target.value))}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value={2}>2 Columns</option>
              <option value={4}>4 Columns</option>
              <option value={5}>5 Columns</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Button Shape</label>
            <select
              value={settings.buttonShape}
              onChange={(e) => handleChange('buttonShape', e.target.value)}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="rounded">Rounded</option>
              <option value="square">Square</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Button Size</label>
            <select
              value={settings.buttonSize}
              onChange={(e) => handleChange('buttonSize', e.target.value)}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showPulseAnimation}
                onChange={(e) => handleChange('showPulseAnimation', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm font-medium">Show Pulse Animation</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}