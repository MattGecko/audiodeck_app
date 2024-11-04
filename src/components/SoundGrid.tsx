import React from 'react';
import { Upload } from 'lucide-react';
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
  onColorChange: (soundId: string, color: string) => void;
  onNameChange: (soundId: string, name: string) => void;
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
  onColorChange,
  onNameChange,
  getCurrentTime,
  getDuration,
  onImportClick,
  selectedSoundId,
  onSoundSelect,
}: SoundGridProps) {
  if (sounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <button
          onClick={onImportClick}
          className="flex flex-col items-center gap-4 p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
            <Upload className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Upload Your First Track</h3>
            <p className="text-gray-600 dark:text-gray-400">Click here to import audio files</p>
          </div>
        </button>
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
            onColorChange={(color) => onColorChange(sound.id, color)}
            onNameChange={(name) => onNameChange(sound.id, name)}
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