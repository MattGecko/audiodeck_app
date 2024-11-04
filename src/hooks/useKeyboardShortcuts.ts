import { useEffect } from 'react';
import type { Sound } from '../types';

interface KeyboardShortcutsProps {
  sounds: Sound[];
  onPlay: (sound: Sound) => void;
  onStop: (soundId: string) => void;
  onDelete: (soundId: string) => void;
  selectedSoundId?: string;
  setSelectedSoundId?: (id: string | undefined) => void;
}

export function useKeyboardShortcuts({
  sounds,
  onPlay,
  onStop,
  onDelete,
  selectedSoundId,
  setSelectedSoundId,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Space bar to play/stop selected sound
      if (event.code === 'Space' && selectedSoundId) {
        event.preventDefault();
        const sound = sounds.find(s => s.id === selectedSoundId);
        if (sound) {
          onPlay(sound);
        }
      }

      // Delete key to remove selected sound
      if ((event.code === 'Delete' || event.code === 'Backspace') && selectedSoundId) {
        event.preventDefault();
        onDelete(selectedSoundId);
        setSelectedSoundId?.(undefined);
      }

      // Number keys 1-9 to quickly select sounds
      const num = parseInt(event.key);
      if (!isNaN(num) && num >= 1 && num <= 9) {
        const sound = sounds[num - 1];
        if (sound) {
          setSelectedSoundId?.(sound.id);
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sounds, onPlay, onStop, onDelete, selectedSoundId, setSelectedSoundId]);
}