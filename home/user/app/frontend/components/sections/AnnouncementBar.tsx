import { IMPERIAL } from '@/lib/theme';
import { SparklesIcon } from 'lucide-react-native';
import { View, Text, TouchableOpacity } from 'react-native';

export default function AnnouncementBar() {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        backgroundColor: IMPERIAL.accent,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: IMPERIAL.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <SparklesIcon size={14} color={IMPERIAL.gold} />
      <Text style={{ fontSize: 13, fontWeight: '600', color: IMPERIAL.gold, textAlign: 'center' }}>
        محرك Manus AI — 7 مراحل ذكية لتنفيذ مهامك
      </Text>
      <SparklesIcon size={14} color={IMPERIAL.gold} />
    </TouchableOpacity>
  );
}
