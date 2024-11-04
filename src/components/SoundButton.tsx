import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, MoreVertical, Volume2, Repeat } from 'lucide-react';
import type { Sound, Settings } from '../types';

interface SoundButtonProps {
  sound: Sound;
  settings: Settings;
  isPlaying: boolean;
  currentTime?: number;
  duration?: number;
  onPlay: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleFavorite: () => void;
  onToggleLoop: () => void;
  onFadeInChange: (duration: number) => void;
  onFadeOutChange: (duration: number) => void;
}

export function SoundButton({
  sound,
  settings,
  isPlaying,
  currentTime = 0,
  duration = 0,
  onPlay,
  onStop,
  onSeek,
  onVolumeChange,
  onToggleFavorite,
  onToggleLoop,
  onFadeInChange,
  onFadeOutChange,
}: SoundButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const buttonSize = {
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
  }[settings.buttonSize];

  const buttonShape = settings.buttonShape === 'square' ? 'rounded-lg' : 'rounded-xl';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`
        relative ${buttonSize} ${buttonShape} border border-gray-200 dark:border-gray-700
        ${sound.color || 'bg-white dark:bg-gray-800'}
        hover:shadow-lg transition-all duration-200
        ${isPlaying ? 'ring-2 ring-blue-500' : ''}
        ${isPlaying && settings.showPulseAnimation ? 'pulse-animation' : ''}
      `}
    >
      {/* Rest of the SoundButton component remains exactly the same */}
    </div>
  );
}