import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

export const light = {
  mode: 'light' as 'light' | 'dark',
  bg: '#f6f7f9', card: '#ffffff', card2: '#f6f7f9', text: '#1a1d23', sub: '#8a8f98',
  line: '#e8eaee', acc: '#1e6fff', accS: '#eaf2ff', ok: '#34c759', warn: '#ff9f0a',
  bad: '#ff3b30', badS: '#ffe9e7', feed: '#c4f03c', feedT: '#1a1d23', track: '#e9ebef',
  ph: '#e9edf3', phIcon: '#aab2bf', tabBg: 'rgba(255,255,255,0.85)', tabBorder: 'rgba(0,0,0,0.06)',
};
export type Theme = typeof light;
export const dark: Theme = {
  mode: 'dark',
  bg: '#0b0b0d', card: '#2a2a2e', card2: '#323237', text: '#ffffff', sub: '#9a9aa2',
  line: '#3c3c42', acc: '#1e6fff', accS: '#16294d', ok: '#32d74b', warn: '#ff9f0a',
  bad: '#ff453a', badS: '#3d1f1d', feed: '#32d74b', feedT: '#06220f', track: '#1b1b1e',
  ph: '#34363c', phIcon: '#6f7480', tabBg: 'rgba(81,81,81,0.55)', tabBorder: 'rgba(255,255,255,0.10)',
};

type Ctx = { t: Theme; toggle: () => void };
const C = createContext<Ctx>({ t: light, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const sys = useColorScheme();
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);
  const mode = override ?? (sys === 'dark' ? 'dark' : 'light');
  const t = mode === 'dark' ? dark : light;
  return (
    <C.Provider value={{ t, toggle: () => setOverride(mode === 'dark' ? 'light' : 'dark') }}>
      {children}
    </C.Provider>
  );
}
export const useTheme = () => useContext(C);

export const R = { card: 24, input: 16, pill: 999, btnH: 52 };
export const FONT = { reg: undefined as string | undefined };
