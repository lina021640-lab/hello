import { Tabs } from 'expo-router';
import { AppTabBar, TAB_ITEMS } from '../../src/components/AppTabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={({ state, navigation }) => <AppTabBar active={state.routes[state.index].name} onPress={(n) => navigation.navigate(n)} />}
      screenOptions={{ headerShown: false }} initialRouteName="home">
      {TAB_ITEMS.map((i) => <Tabs.Screen key={i.name} name={i.name} />)}
    </Tabs>
  );
}
