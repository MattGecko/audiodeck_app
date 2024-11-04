import React, { useState } from 'react';
import { Play, Pause, Heart, Volume2, RefreshCw, Trash2, Palette, Edit2 } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface SoundCardProps {
  sound: Sound;
  settings: Settings;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleFavorite: () => void;
  onToggleLoop: () => void;
  onDelete: () => void;
  onColorChange: (color: string) => void;
  currentTime: number;
  duration: number;
  isSelected?: boolean;
  onSelect?: () => void;
  onNameChange: (name: string) => void;
}

export function SoundCard({
  sound,
  settings,
  isPlaying,
  onPlay,
  onStop,
  onSeek,
  onVolumeChange,
  onToggleFavorite,
  onToggleLoop,
  onDelete,
  onColorChange,
  currentTime,
  duration,
  isSelected,
  onSelect,
  onNameChange,
}: SoundCardProps) {
  const [volume, setVolume] = useState(sound.volume);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(sound.name);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    onVolumeChange(newVolume);
  };

  const handleNameSubmit = () => {
    if (editedName.trim()) {
      onNameChange(editedName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setEditedName(sound.name);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full
        flex flex-col
        ${isPlaying ? 'ring-2 ring-blue-500' : ''} 
        ${settings.showPulseAnimation && isPlaying ? 'pulse-animation' : ''}
        ${isSelected ? 'ring-2 ring-blue-300' : ''}
        cursor-pointer
      `}
      style={sound.color ? { borderColor: sound.color, borderWidth: '3px' } : undefined}
      onClick={onSelect}
    >
      <div className="flex items-center justify-end gap-1 mb-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          title={sound.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 ${sound.favorite ? 'fill-red-500 text-red-500' : ''}`}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
          }}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Change color"
        >
          <Palette className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Edit name"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {showColorPicker && (
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <ColorPicker
            value={sound.color || ''}
            onChange={onColorChange}
            className="justify-center"
          />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center mb-3">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyPress}
            className="w-full px-2 py-1 text-center bg-transparent border-b-2 border-blue-500 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <h3 className="font-medium text-center">{sound.name}</h3>
        )}
      </div>

      <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLoop();
            }}
            className={`p-1.5 rounded-full ${sound.loop ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            title={sound.loop ? 'Disable loop' : 'Enable loop'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
            title="Delete sound"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="volume-slider"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <Volume2 className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="progress-slider"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            isPlaying ? onStop() : onPlay();
          }}
          className="w-full py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span className="text-sm font-medium">{isPlaying ? 'Stop' : 'Play'}</span>
        </button>
      </div>
    </div>
  );
}