/** 인증 스토어 (useSyncExternalStore). 세션 복원 · 로그인/가입/로그아웃 · 프로필(닉네임). */
import { useSyncExternalStore } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, koError } from '../lib/supabase';

type State = { loading: boolean; session: Session | null; nickname: string | null };
let state: State = { loading: true, session: null, nickname: null };
const subs = new Set<() => void>();
const set = (p: Partial<State>) => { state = { ...state, ...p }; subs.forEach((f) => f()); };

let started = false;
async function loadProfile(uid: string, user?: User | null) {
  try {
    const { data } = await supabase.from('profiles').select('nickname').eq('id', uid).maybeSingle();
    const nick = data?.nickname ?? (user?.user_metadata?.nickname as string | undefined) ?? user?.email?.split('@')[0] ?? null;
    if (state.session?.user.id === uid) set({ nickname: nick });
  } catch { /* 프로필은 없어도 앱은 동작 */ }
}
function apply(session: Session | null) {
  const prev = state.session?.user.id;
  set({ session, loading: false, nickname: session ? (session.user.user_metadata?.nickname as string | undefined) ?? state.nickname : null });
  if (session && session.user.id !== prev) loadProfile(session.user.id, session.user);
}
/** 앱 시작 시 한 번: 저장된 세션 복원 + 변화 구독 */
export function startAuth() {
  if (started) return; started = true;
  supabase.auth.getSession()
    .then(({ data }) => apply(data.session))
    .catch(() => set({ loading: false }));
  supabase.auth.onAuthStateChange((_e, session) => apply(session));
}

export const getAuth = () => state;
export function useAuth() {
  startAuth();
  const s = useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => state, () => state);
  return { ...s, user: s.session?.user ?? null, email: s.session?.user.email ?? null };
}
export const subscribeAuth = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };

export type AuthResult = { ok: true; needsConfirm?: boolean } | { ok: false; error: string };

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { ok: false, error: koError(error) };
    apply(data.session);
    return { ok: true };
  } catch (e) { return { ok: false, error: koError(e) }; }
}

export async function signUp(email: string, password: string, nickname: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { nickname: nickname.trim() } } });
    if (error) return { ok: false, error: koError(error) };
    // 이미 가입된 이메일(확인 메일 켜짐)은 identities 가 빈 배열로 돌아온다
    if (data.user && data.user.identities && data.user.identities.length === 0) return { ok: false, error: '이미 가입된 이메일이에요' };
    if (!data.session) return { ok: true, needsConfirm: true };
    apply(data.session);
    return { ok: true };
  } catch (e) { return { ok: false, error: koError(e) }; }
}

export async function signOut() {
  try { await supabase.auth.signOut(); } catch { /* 네트워크 실패해도 로컬 세션은 지운다 */ }
  try { await supabase.auth.signOut({ scope: 'local' }); } catch { /* ignore */ }
  apply(null);
}

export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) return { ok: false, error: koError(error) };
    return { ok: true };
  } catch (e) { return { ok: false, error: koError(e) }; }
}

export async function updateNickname(nickname: string): Promise<AuthResult> {
  const uid = state.session?.user.id; const nick = nickname.trim();
  if (!uid) return { ok: false, error: '로그인이 필요해요' };
  if (!nick) return { ok: false, error: '닉네임을 입력해 주세요' };
  try {
    const { error } = await supabase.from('profiles').update({ nickname: nick }).eq('id', uid);
    if (error) return { ok: false, error: koError(error) };
    set({ nickname: nick });
    return { ok: true };
  } catch (e) { return { ok: false, error: koError(e) }; }
}
