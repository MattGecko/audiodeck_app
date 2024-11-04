export interface Sound {
  id: string;
  name: string;
  file: string;
  color?: string;
  hotkey?: string;
  volume: number;
  loop: boolean;
  favorite: boolean;
  groupId?: string;
  fadeIn?: number;
  fadeOut?: number;
}

export interface SoundGroup {
  id: string;
  name: string;
  soundIds: string[];
}

export interface Settings {
  theme: 'light' | 'dark';
  gridColumns: number;
  buttonShape: 'rounded' | 'square';
  buttonSize: 'small' | 'medium' | 'large';
  fadeInDuration: number;
  fadeOutDuration: number;
  showPulseAnimation: boolean;
}