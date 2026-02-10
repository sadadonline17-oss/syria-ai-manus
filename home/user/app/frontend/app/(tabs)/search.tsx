import { MANUS } from '@/lib/theme';
import { SearchIcon } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const recentSearches = ['Build website', 'Create slides', 'Data analysis', 'Resume builder'];
const trendingTopics = ['AI Automation', 'Web Development', 'Data Visualization', 'Content Writing', 'API Integration'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: MANUS.background }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: MANUS.text }}>Search</Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: MANUS.card,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: MANUS.border,
            paddingHorizontal: 12,
            height: 48,
            gap: 8,
          }}
        >
          <SearchIcon size={20} color={MANUS.textTertiary} />
          <TextInput
            placeholder="Search tasks, templates..."
            placeholderTextColor={MANUS.textTertiary}
            value={query}
            onChangeText={setQuery}
            style={{ flex: 1, fontSize: 15, color: MANUS.text }}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: MANUS.textSecondary, marginBottom: 12 }}>
          Recent
        </Text>
        <View style={{ gap: 8 }}>
          {recentSearches.map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 8,
              }}
            >
              <SearchIcon size={16} color={MANUS.textTertiary} />
              <Text style={{ fontSize: 15, color: MANUS.text }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: MANUS.textSecondary, marginBottom: 12 }}>
          Trending
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {trendingTopics.map((topic) => (
            <TouchableOpacity
              key={topic}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: MANUS.card,
                borderWidth: 1,
                borderColor: MANUS.border,
              }}
            >
              <Text style={{ fontSize: 13, color: MANUS.text }}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
