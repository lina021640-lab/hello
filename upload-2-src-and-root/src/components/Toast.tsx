import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { T } from '../kit';

/** 작은 토스트: const [toast, node] = useToast(); toast('준비 중'); ... {node} */
export function useToast(): [(msg: string) => void, React.ReactNode] {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((m: string) => {
    setMsg(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 1600);
  }, []);
  const node = msg ? (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 60, alignItems: 'center' }}>
      <View style={{ backgroundColor: 'rgba(0,0,0,0.82)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 }}>
        <T size={13} w="m" color="#fff">{msg}</T>
      </View>
    </View>
  ) : null;
  return [show, node];
}
