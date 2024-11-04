import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SoundGrid } from './components/SoundGrid';
import { SettingsModal } from './components/SettingsModal';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import type { Sound, Settings } from './types';

const getInitialSettings = (): Settings => ({
  theme: localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  gridColumns: Number(localStorage.getItem('gridColumns')) || 4,
  buttonShape: localStorage.getItem('buttonShape') as 'rounded' | 'square' || 'rounded',
  buttonSize: localStorage.getItem('buttonSize') as 'small' | 'medium' | 'large' || 'medium',
  fadeInDuration: Number(localStorage.getItem('fadeInDuration')) || 0.1,
  fadeOutDuration: Number(localStorage.getItem('fadeOutDuration')) || 0.1,
  showPulseAnimation: localStorage.getItem('showPulseAnimation') !== 'false',
});

function App() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [settings, setSettings] = useState<Settings>(getInitialSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSoundId, setSelectedSoundId] = useState<string>();
  
  const { 
    loadSound,
    playSound, 
    stopSound, 
    playingSounds,
    setVolume, 
    seekSound,
    playbackInfo
  } = useAudioPlayer();

  useEffect(() => {
    const savedSounds = localStorage.getItem('sounds');
    if (savedSounds) {
      const parsedSounds = JSON.parse(savedSounds);
      setSounds(parsedSounds);
      parsedSounds.forEach(loadSound);
    }
  }, [loadSound]);

  useEffect(() => {
    localStorage.setItem('sounds', JSON.stringify(sounds));
  }, [sounds]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(settings.theme);
    localStorage.setItem('theme', settings.theme);
  }, [settings.theme]);

  const handleThemeToggle = () => {
    setSettings(prev => {
      const newTheme = prev.theme === 'light' ? 'dark' : 'light';
      return { ...prev, theme: newTheme };
    });
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const handleToggleFavorite = (soundId: string) => {
    setSounds(prevSounds =>
      prevSounds.map(sound =>
        sound.id === soundId
          ? { ...sound, favorite: !sound.favorite }
          : sound
      )
    );
  };

  const handleToggleLoop = (soundId: string) => {
    setSounds(prevSounds =>
      prevSounds.map(sound =>
        sound.id === soundId
          ? { ...sound, loop: !sound.loop }
          : sound
      )
    );
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        const newSound: Sound = {
          id: Math.random().toString(36).substring(7),
          name: file.name.replace(/\.[^/.]+$/, ""),
          file: url,
          volume: 1,
          loop: false,
          favorite: false,
        };
        setSounds(prev => [...prev, newSound]);
        loadSound(newSound);
      });
    };

    input.click();
  };

  const handleDeleteSound = (soundId: string) => {
    setSounds(prevSounds => prevSounds.filter(sound => sound.id !== soundId));
    stopSound(soundId);
    if (selectedSoundId === soundId) {
      setSelectedSoundId(undefined);
    }
  };

  const handleUpdateSound = (soundId: string, updates: Partial<Sound>) => {
    setSounds(prevSounds =>
      prevSounds.map(sound =>
        sound.id === soundId
          ? { ...sound, ...updates }
          : sound
      )
    );
  };

  const filteredSounds = sounds.filter(sound =>
    sound.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useKeyboardShortcuts({
    sounds: filteredSounds,
    onPlay: playSound,
    onStop: stopSound,
    onDelete: handleDeleteSound,
    selectedSoundId,
    setSelectedSoundId,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header 
        isDark={settings.theme === 'dark'}
        toggleTheme={handleThemeToggle}
        onImportClick={handleImportClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSettingsClick={() => setShowSettings(true)}
      />
      <main className="container mx-auto px-4 py-8">
        <SoundGrid
          sounds={filteredSounds}
          settings={settings}
          isPlaying={playingSounds}
          onPlay={playSound}
          onStop={stopSound}
          onSeek={seekSound}
          onVolumeChange={setVolume}
          onToggleFavorite={handleToggleFavorite}
          onToggleLoop={handleToggleLoop}
          onDelete={handleDeleteSound}
          onUpdateSound={handleUpdateSound}
          getCurrentTime={(id) => playbackInfo.get(id)?.currentTime || 0}
          getDuration={(id) => playbackInfo.get(id)?.duration || 0}
          onImportClick={handleImportClick}
          selectedSoundId={selectedSoundId}
          onSoundSelect={setSelectedSoundId}
        />
      </main>
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

export default App;