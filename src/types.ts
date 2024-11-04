export interface Sound {
  id: string;
  name: string;
  file: string;
  volume: number;
  loop: boolean;
  favorite: boolean;
  color?: string;
  image?: string;
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