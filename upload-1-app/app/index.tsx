import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/data/authStore';
import { useTheme } from '../src/kit';

/** 시작 화면: 세션 복원 후 로그인 여부로 분기 */
export default function Index() {
  const { loading, session } = useAuth(); const { t } = useTheme();
  if (loading) return <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={t.acc} /></View>;
  return <Redirect href={session ? '/home' : '/auth/login'} />;
}
