import React, { memo } from 'react';
import { Droppable, type DroppableProvided, type DroppableStateSnapshot } from 'react-beautiful-dnd';
import { DraggableSoundCard } from './DraggableSoundCard';
import type { Sound, Settings } from '../types';

interface DroppableSoundGridProps {
  sounds: Sound[];
  settings: Settings;
  isPlaying: Set<string>;
  onPlay: (sound: Sound) => void;
  onStop: (soundId: string) => void;
  onSeek: (soundId: string, time: number) => void;
  onVolumeChange: (soundId: string, volume: number) => void;
  onToggleFavorite: (soundId: string) => void;
  onToggleLoop: (soundId: string) => void;
  onFadeInChange: (soundId: string, duration: number) => void;
  onFadeOutChange: (soundId: string, duration: number) => void;
  getCurrentTime: (soundId: string) => number;
  getDuration: (soundId: string) => number;
}

function DroppableGrid({
  sounds,
  settings,
  isPlaying,
  onPlay,
  onStop,
  onSeek,
  onVolumeChange,
  onToggleFavorite,
  onToggleLoop,
  onFadeInChange,
  onFadeOutChange,
  getCurrentTime,
  getDuration,
}: DroppableSoundGridProps) {
  const gridColumnsClass = `grid-cols-${settings.gridColumns}`;

  const renderDroppableContent = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={`grid gap-4 ${gridColumnsClass}`}
      style={{ 
        minHeight: '100px',
        backgroundColor: snapshot.isDraggingOver ? 'rgba(0, 0, 0, 0.02)' : undefined,
        transition: 'background-color 0.2s ease'
      }}
    >
      {sounds.map((sound, index) => (
        <DraggableSoundCard
          key={sound.id}
          sound={sound}
          index={index}
          settings={settings}
          isPlaying={isPlaying.has(sound.id)}
          onPlay={() => onPlay(sound)}
          onStop={() => onStop(sound.id)}
          onSeek={(time) => onSeek(sound.id, time)}
          onVolumeChange={(volume) => onVolumeChange(sound.id, volume)}
          onToggleFavorite={() => onToggleFavorite(sound.id)}
          onToggleLoop={() => onToggleLoop(sound.id)}
          onFadeInChange={(duration) => onFadeInChange(sound.id, duration)}
          onFadeOutChange={(duration) => onFadeOutChange(sound.id, duration)}
          currentTime={getCurrentTime(sound.id)}
          duration={getDuration(sound.id)}
        />
      ))}
      {provided.placeholder}
    </div>
  );

  return (
    <Droppable 
      droppableId="sounds"
      direction="vertical"
      renderClone={(provided, snapshot, rubric) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <DraggableSoundCard
            sound={sounds[rubric.source.index]}
            index={rubric.source.index}
            settings={settings}
            isPlaying={isPlaying.has(sounds[rubric.source.index].id)}
            onPlay={() => onPlay(sounds[rubric.source.index])}
            onStop={() => onStop(sounds[rubric.source.index].id)}
            onSeek={(time) => onSeek(sounds[rubric.source.index].id, time)}
            onVolumeChange={(volume) => onVolumeChange(sounds[rubric.source.index].id, volume)}
            onToggleFavorite={() => onToggleFavorite(sounds[rubric.source.index].id)}
            onToggleLoop={() => onToggleLoop(sounds[rubric.source.index].id)}
            onFadeInChange={(duration) => onFadeInChange(sounds[rubric.source.index].id, duration)}
            onFadeOutChange={(duration) => onFadeOutChange(sounds[rubric.source.index].id, duration)}
            currentTime={getCurrentTime(sounds[rubric.source.index].id)}
            duration={getDuration(sounds[rubric.source.index].id)}
          />
        </div>
      )}
    >
      {renderDroppableContent}
    </Droppable>
  );
}

export const DroppableSoundGrid = memo(DroppableGrid);