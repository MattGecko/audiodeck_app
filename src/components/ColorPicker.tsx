import React from 'react';

const COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className = '' }: ColorPickerProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {COLORS.map((color) => (
        <button
          key={color}
          className={`w-6 h-6 rounded-full transition-transform hover:scale-110 
            ${value === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          title={color}
        />
      ))}
    </div>
  );
}