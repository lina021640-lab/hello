import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 공개(publishable) 키만 사용한다. service/secret 키는 절대 클라이언트에 넣지 말 것.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xllzghpdvpvyvwwarjoj.supabase.co';
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY || 'sb_publishable_T8T1nvAS52b1fJI3lr-sHw_oLAWp6Vz';

export const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

/** Supabase/네트워크 오류 → 한국어 메시지 */
export function koError(e: unknown, fallback = '문제가 생겼어요. 잠시 후 다시 시도해 주세요'): string {
  const err = e as { message?: string; code?: string; status?: number } | null;
  const m = (err?.message ?? String(e ?? '')).toLowerCase();
  if (!m) return fallback;
  if (m.includes('failed to fetch') || m.includes('network') || m.includes('fetch failed') || m.includes('load failed') || m.includes('timeout') || err?.status === 0)
    return '네트워크에 연결할 수 없어요. 인터넷 연결을 확인해 주세요';
  if (m.includes('invalid login credentials')) return '이메일 또는 비밀번호가 올바르지 않아요';
  if (m.includes('email not confirmed')) return '메일로 보낸 인증 링크를 눌러 주세요';
  if (m.includes('already registered') || m.includes('already been registered') || err?.code === 'user_already_exists') return '이미 가입된 이메일이에요';
  if (m.includes('password') && (m.includes('at least') || m.includes('weak') || m.includes('short'))) return '비밀번호는 6자 이상이어야 해요';
  if (m.includes('valid email') || m.includes('invalid email') || (m.includes('email') && m.includes('invalid'))) return '올바른 이메일 주소를 입력해 주세요';
  if (m.includes('rate limit') || m.includes('too many') || err?.status === 429) return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요';
  if (m.includes('jwt') || m.includes('not authenticated') || m.includes('로그인이 필요')) return '로그인이 필요해요';
  if (m.includes('초대 코드를 찾을 수 없어요')) return '초대 코드를 찾을 수 없어요';
  if (m.includes('row-level security') || m.includes('permission denied')) return '권한이 없어요';
  if (m.includes('relation') && m.includes('does not exist')) return '서버 설정이 아직 끝나지 않았어요 (schema.sql 실행 필요)';
  return fallback;
}
