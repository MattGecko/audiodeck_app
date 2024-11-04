import React, { useState, useCallback } from 'react';
import { Upload, Music } from 'lucide-react';
import { SoundCard } from './SoundCard';
import type { Sound, Settings } from '../types';

interface SoundGridProps {
  sounds: Sound[];
  settings: Settings;
  isPlaying: Set<string>;
  onPlay: (sound: Sound) => void;
  onStop: (soundId: string) => void;
  onSeek: (soundId: string, time: number) => void;
  onVolumeChange: (soundId: string, volume: number) => void;
  onToggleFavorite: (soundId: string) => void;
  onToggleLoop: (soundId: string) => void;
  onDelete: (soundId: string) => void;
  onUpdateSound: (soundId: string, updates: Partial<Sound>) => void;
  getCurrentTime: (soundId: string) => number;
  getDuration: (soundId: string) => number;
  onImportClick: () => void;
  selectedSoundId?: string;
  onSoundSelect: (soundId: string) => void;
}

export function SoundGrid({
  sounds,
  settings,
  isPlaying,
  onPlay,
  onStop,
  onSeek,
  onVolumeChange,
  onToggleFavorite,
  onToggleLoop,
  onDelete,
  onUpdateSound,
  getCurrentTime,
  getDuration,
  onImportClick,
  selectedSoundId,
  onSoundSelect,
}: SoundGridProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('audio/') || file.name.endsWith('.mp3')
    );

    if (files.length > 0) {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.files = e.dataTransfer.files;
      onImportClick();
    }
  }, [onImportClick]);

  if (sounds.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-[600px] px-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div 
          className={`
            w-full max-w-2xl p-12 rounded-2xl 
            border-4 border-dashed border-gray-700 
            ${isDragging ? 'border-blue-500 bg-gray-800/70' : 'bg-gray-800/50'} 
            transition-all duration-200 ease-in-out
            flex flex-col items-center gap-8
            cursor-pointer
            group
            hover:border-blue-500 hover:bg-gray-800/70
          `}
          onClick={onImportClick}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-colors" />
            <div className="relative">
              <Music className="w-16 h-16 text-blue-400 mb-4" />
              <div className="absolute -right-2 -bottom-2 bg-gray-800 rounded-full p-2">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="text-center relative z-10">
            <h3 className="text-2xl font-bold mb-3 text-white">
              {isDragging ? 'Drop your audio files here' : 'Upload Your Tracks'}
            </h3>
            <p className="text-gray-400 text-lg mb-6">
              Drag and drop your audio files or click to browse
            </p>
            <div className="text-sm text-gray-500">
              Supports MP3, WAV, and other audio formats
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="grid gap-4 p-4"
      style={{
        gridTemplateColumns: `repeat(${settings.gridColumns}, minmax(0, 1fr))`,
        gridAutoRows: '1fr'
      }}
    >
      {sounds.map((sound) => (
        <div key={sound.id} className="aspect-square">
          <SoundCard
            sound={sound}
            settings={settings}
            isPlaying={isPlaying.has(sound.id)}
            onPlay={() => onPlay(sound)}
            onStop={() => onStop(sound.id)}
            onSeek={(time) => onSeek(sound.id, time)}
            onVolumeChange={(volume) => onVolumeChange(sound.id, volume)}
            onToggleFavorite={() => onToggleFavorite(sound.id)}
            onToggleLoop={() => onToggleLoop(sound.id)}
            onDelete={() => onDelete(sound.id)}
            onColorChange={(color) => onUpdateSound(sound.id, { color })}
            onNameChange={(name) => onUpdateSound(sound.id, { name })}
            currentTime={getCurrentTime(sound.id)}
            duration={getDuration(sound.id)}
            isSelected={sound.id === selectedSoundId}
            onSelect={() => onSoundSelect(sound.id)}
          />
        </div>
      ))}
    </div>
  );
}