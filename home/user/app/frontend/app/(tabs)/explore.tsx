import { MANUS } from '@/lib/theme';
import { LayoutGridIcon } from 'lucide-react-native';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categories = [
  { name: 'Productivity', emoji: '⚡' },
  { name: 'Design', emoji: '🎨' },
  { name: 'Development', emoji: '💻' },
  { name: 'Writing', emoji: '✍️' },
  { name: 'Data', emoji: '📊' },
  { name: 'Marketing', emoji: '📢' },
];

const featured = [
  { title: 'Build a Landing Page', description: 'Create a modern, responsive landing page for your product.' },
  { title: 'Analyze Sales Data', description: 'Get insights from your sales data with charts and summaries.' },
  { title: 'Write Blog Posts', description: 'Generate engaging blog content on any topic.' },
  { title: 'Design Social Media', description: 'Create eye-catching social media graphics and posts.' },
  { title: 'Code Review', description: 'Get detailed feedback on your code quality and best practices.' },
  { title: 'Email Campaign', description: 'Draft and optimize email marketing campaigns.' },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: MANUS.background }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 40 }}
    >
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: MANUS.text }}>Explore</Text>
        <Text style={{ fontSize: 14, color: MANUS.textSecondary, marginTop: 4 }}>
          Discover what Manus can do for you
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        style={{ marginBottom: 24 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.name}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: MANUS.border,
              backgroundColor: MANUS.card,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: MANUS.text }}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: MANUS.text, marginBottom: 12 }}>
          Featured Tasks
        </Text>
        <View style={{ gap: 12 }}>
          {featured.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={{
                backgroundColor: MANUS.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: MANUS.border,
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '500', color: MANUS.text }}>{item.title}</Text>
              <Text style={{ fontSize: 13, color: MANUS.textTertiary, marginTop: 4 }}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
