import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { SoundCard } from './SoundCard';
import type { Sound, Settings } from '../types';

interface DraggableSoundCardProps {
  sound: Sound;
  index: number;
  settings: Settings;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleFavorite: () => void;
  onToggleLoop: () => void;
  onFadeInChange: (duration: number) => void;
  onFadeOutChange: (duration: number) => void;
}

export function DraggableSoundCard(props: DraggableSoundCardProps) {
  const {
    sound,
    index,
    settings,
    isPlaying,
    currentTime,
    duration,
    onPlay,
    onStop,
    onSeek,
    onVolumeChange,
    onToggleFavorite,
    onToggleLoop,
    onFadeInChange,
    onFadeOutChange,
  } = props;

  return (
    <Draggable draggableId={sound.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            zIndex: snapshot.isDragging ? 9999 : 'auto',
          }}
        >
          <SoundCard
            sound={sound}
            settings={settings}
            isPlaying={isPlaying}
            onPlay={onPlay}
            onStop={onStop}
            onSeek={onSeek}
            onVolumeChange={onVolumeChange}
            onToggleFavorite={onToggleFavorite}
            onToggleLoop={onToggleLoop}
            onFadeInChange={onFadeInChange}
            onFadeOutChange={onFadeOutChange}
            currentTime={currentTime}
            duration={duration}
          />
        </div>
      )}
    </Draggable>
  );
}