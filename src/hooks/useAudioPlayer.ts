import { useState, useEffect, useCallback, useRef } from 'react';
import type { Sound } from '../types';

interface PlaybackInfo {
  currentTime: number;
  duration: number;
}

export function useAudioPlayer() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffers, setAudioBuffers] = useState<Map<string, AudioBuffer>>(new Map());
  const [playingSounds, setPlayingSounds] = useState<Set<string>>(new Set());
  const [activeNodes, setActiveNodes] = useState<Map<string, [AudioBufferSourceNode, GainNode]>>(new Map());
  const [playbackInfo, setPlaybackInfo] = useState<Map<string, PlaybackInfo>>(new Map());
  const startTimesRef = useRef<Map<string, number>>(new Map());
  const pendingPlayRef = useRef<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const ctx = new AudioContext();
    setAudioContext(ctx);
    setIsInitialized(true);
    return () => {
      ctx.close();
    };
  }, []);

  const loadSound = useCallback(async (sound: Sound) => {
    if (!audioContext) return;

    try {
      const response = await fetch(sound.file);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffers(prev => new Map(prev.set(sound.id, audioBuffer)));
      setPlaybackInfo(prev => new Map(prev.set(sound.id, {
        currentTime: 0,
        duration: audioBuffer.duration,
      })));

      if (pendingPlayRef.current.has(sound.id)) {
        pendingPlayRef.current.delete(sound.id);
        playSound(sound);
      }
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }, [audioContext]);

  const stopSound = useCallback((soundId: string) => {
    const nodes = activeNodes.get(soundId);
    if (!nodes || !audioContext) return;

    const [source, gainNode] = nodes;
    const fadeOutDuration = 0.1;

    gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeOutDuration);

    setTimeout(() => {
      try {
        source.stop();
      } catch (e) {
        // Ignore errors if source is already stopped
      }
    }, fadeOutDuration * 1000);

    startTimesRef.current.delete(soundId);
    setPlayingSounds(prev => new Set([...prev].filter(id => id !== soundId)));
    setActiveNodes(prev => new Map([...prev].filter(([id]) => id !== soundId)));
    
    const buffer = audioBuffers.get(soundId);
    if (buffer) {
      setPlaybackInfo(prev => new Map(prev.set(soundId, {
        currentTime: 0,
        duration: buffer.duration,
      })));
    }
  }, [audioContext, activeNodes, audioBuffers]);

  const setVolume = useCallback((soundId: string, volume: number) => {
    const nodes = activeNodes.get(soundId);
    if (nodes && audioContext) {
      const [, gainNode] = nodes;
      gainNode.gain.cancelScheduledValues(audioContext.currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.05);
    }
  }, [audioContext, activeNodes]);

  const seekSound = useCallback((soundId: string, time: number) => {
    if (!audioContext || !audioBuffers.has(soundId)) return;

    const buffer = audioBuffers.get(soundId);
    const currentNodes = activeNodes.get(soundId);

    if (!buffer) return;

    if (playingSounds.has(soundId) && currentNodes) {
      const [oldSource, gainNode] = currentNodes;
      oldSource.stop();

      const newSource = audioContext.createBufferSource();
      newSource.buffer = buffer;
      newSource.loop = oldSource.loop;
      newSource.connect(gainNode);
      newSource.start(0, time);

      startTimesRef.current.set(soundId, audioContext.currentTime - time);
      setActiveNodes(prev => new Map(prev.set(soundId, [newSource, gainNode])));
    }

    setPlaybackInfo(prev => new Map(prev.set(soundId, {
      currentTime: time,
      duration: buffer.duration,
    })));
  }, [audioContext, audioBuffers, activeNodes, playingSounds]);

  const playSound = useCallback((sound: Sound) => {
    if (!audioContext) {
      return;
    }

    if (!audioBuffers.has(sound.id)) {
      pendingPlayRef.current.add(sound.id);
      loadSound(sound);
      return;
    }

    if (activeNodes.has(sound.id)) {
      stopSound(sound.id);
      return;
    }

    const buffer = audioBuffers.get(sound.id);
    if (!buffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = sound.loop;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = sound.volume;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start();
    
    startTimesRef.current.set(sound.id, audioContext.currentTime);
    setPlayingSounds(prev => new Set(prev.add(sound.id)));
    setActiveNodes(prev => new Map(prev.set(sound.id, [source, gainNode])));

    if (!sound.loop) {
      setTimeout(() => {
        setPlayingSounds(prev => new Set([...prev].filter(id => id !== sound.id)));
        setActiveNodes(prev => new Map([...prev].filter(([id]) => id !== sound.id)));
        startTimesRef.current.delete(sound.id);
        setPlaybackInfo(prev => new Map(prev.set(sound.id, {
          currentTime: 0,
          duration: buffer.duration,
        })));
      }, buffer.duration * 1000);
    }
  }, [audioContext, audioBuffers, activeNodes, stopSound, loadSound]);

  useEffect(() => {
    let animationFrame: number;
    
    function updatePlaybackTimes() {
      if (!audioContext) return;

      setPlaybackInfo(prev => {
        const newInfo = new Map(prev);
        for (const [soundId] of activeNodes) {
          const buffer = audioBuffers.get(soundId);
          const startTime = startTimesRef.current.get(soundId);
          
          if (buffer && startTime !== undefined) {
            const elapsed = audioContext.currentTime - startTime;
            const currentTime = elapsed % buffer.duration;
            
            newInfo.set(soundId, {
              currentTime,
              duration: buffer.duration,
            });
          }
        }
        return newInfo;
      });

      animationFrame = requestAnimationFrame(updatePlaybackTimes);
    }

    if (activeNodes.size > 0) {
      updatePlaybackTimes();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [audioContext, activeNodes, audioBuffers]);

  return {
    loadSound,
    playSound,
    stopSound,
    setVolume,
    seekSound,
    playingSounds,
    playbackInfo,
    isInitialized,
  };
}