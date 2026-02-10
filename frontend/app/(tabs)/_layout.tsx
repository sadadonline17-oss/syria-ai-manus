import { IMPERIAL } from '@/lib/theme';
import { Tabs } from 'expo-router';
import {
  HomeIcon,
  MessageSquareIcon,
  CodeIcon,
  GitBranchIcon,
  LayoutGridIcon,
} from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: IMPERIAL.gold,
        tabBarInactiveTintColor: IMPERIAL.textTertiary,
        tabBarStyle: {
          backgroundColor: IMPERIAL.cardSolid,
          borderTopColor: IMPERIAL.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 0,
          shadowColor: IMPERIAL.gold,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'المحادثة',
          tabBarIcon: ({ color, size }) => <MessageSquareIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workbench"
        options={{
          title: 'Workbench',
          tabBarIcon: ({ color, size }) => <CodeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="git"
        options={{
          title: 'Git',
          tabBarIcon: ({ color, size }) => <GitBranchIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'المزيد',
          tabBarIcon: ({ color, size }) => <LayoutGridIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
