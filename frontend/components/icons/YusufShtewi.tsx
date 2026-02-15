import { View, Text, StyleSheet } from 'react-native';
import { IMPERIAL } from '../../lib/theme';

interface YusufShtewiProps {
  size?: number;
  showName?: boolean;
}

export default function YusufShtewi({ size = 40, showName = false }: YusufShtewiProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: IMPERIAL.accent,
          },
        ]}>
        <Text
          style={[
            styles.initials,
            {
              fontSize: size * 0.4,
              color: IMPERIAL.gold,
            },
          ]}>
          YS
        </Text>
      </View>
      {showName && (
        <Text style={[styles.name, { color: IMPERIAL.text }]}>Yusuf Shtewi</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  initials: {
    fontWeight: '700',
  },
  name: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});
