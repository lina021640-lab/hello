/** 내 프로필 사진 + 친구 프로필 사진 (메모리 저장소; 서버 연결 시 사용자 DB로 교체) */
import { useSyncExternalStore } from 'react';

type S = { me?: string; friends: Record<string, string | undefined> };
let state: S = { me: undefined, friends: {} };
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
export const profile = {
  get: () => state,
  setMe: (uri?: string) => { state = { ...state, me: uri }; emit(); },
  /** 친구가 자기 프로필에 사진을 넣으면 이 함수로 반영 → 아바타 묶음·일행 목록에 모두 보임 */
  setFriend: (id: string, uri?: string) => { state = { ...state, friends: { ...state.friends, [id]: uri } }; emit(); },
};
export function useProfile() {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb); }; }, profile.get, profile.get);
}
