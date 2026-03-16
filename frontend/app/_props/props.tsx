export interface setModeProps {
  setMode: (mode: Mode) => void;
  mode: 'login' | 'register' | 'recovery';
}

export interface modeProps {
  mode: 'login' | 'register' | 'recovery';
}

export type Mode = 'login' | 'register' | 'recovery';