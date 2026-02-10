import { MANUS } from '@/lib/theme';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const footerSections = [
  {
    title: 'Product',
    links: ['Chat', 'Search', 'Analyze', 'Personalize', 'Automation'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Help Center', 'Blog', 'Changelog', 'API Reference'],
  },
  {
    title: 'Community',
    links: ['Twitter / X', 'Discord', 'GitHub', 'LinkedIn'],
  },
  {
    title: 'Compare',
    links: ['vs ChatGPT', 'vs Claude', 'vs Perplexity', 'vs Gemini'],
  },
  {
    title: 'Download',
    links: ['iOS App', 'Android App', 'macOS Desktop', 'Windows Desktop'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Privacy', 'Terms', 'Contact'],
  },
];

export default function Footer() {
  return (
    <View
      style={{
        backgroundColor: MANUS.background,
        borderTopWidth: 1,
        borderTopColor: MANUS.border,
        paddingVertical: 40,
        paddingHorizontal: 24,
        marginTop: 40,
      }}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
        {footerSections.map((section) => (
          <View key={section.title} style={{ width: '45%', marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: MANUS.text, marginBottom: 12 }}>
              {section.title}
            </Text>
            {section.links.map((link) => (
              <TouchableOpacity key={link} activeOpacity={0.7} style={{ paddingVertical: 4 }}>
                <Text style={{ fontSize: 13, color: MANUS.textSecondary }}>{link}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={{ borderTopWidth: 1, borderTopColor: MANUS.border, paddingTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Svg height={20} width={15} viewBox="0 0 24 32">
            <Path
              d="M12 2C10.9 2 10 2.9 10 4V16.38L7.91 14.12C7.54 13.72 6.89 13.7 6.47 14.07C6.06 14.44 6.04 15.09 6.4 15.5L10.67 20.12C11.5 21.03 12.63 21.5 13.79 21.5H18C19.1 21.5 20 20.6 20 19.5V7C20 5.9 19.1 5 18 5C17.72 5 17.5 5.22 17.5 5.5V11H16.5V3C16.5 1.9 15.6 1 14.5 1C13.4 1 12.5 1.9 12.5 3V11H12V2Z"
              fill={MANUS.text}
            />
          </Svg>
          <Text style={{ fontSize: 16, fontWeight: '600', color: MANUS.text, letterSpacing: -0.5 }}>
            manus
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: MANUS.textTertiary }}>
          © {new Date().getFullYear()} Manus. All rights reserved. · Part of Meta
        </Text>
      </View>
    </View>
  );
}
