import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, Pattern, Rect, G } from 'react-native-svg';
import { IMPERIAL } from '@/lib/theme';

/**
 * IslamicPattern - A geometric background pattern component
 * Provides a sophisticated Islamic geometric motif common in Syrian art.
 */
export default function IslamicPattern() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id="geometric"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse">
            <G transform="scale(0.5)">
              {/* Complex Octagonal Star Motif */}
              <Path
                d="M120,0 L150,30 L150,70 L120,100 L80,100 L50,70 L50,30 L80,0 Z"
                fill="none"
                stroke={IMPERIAL.border}
                strokeWidth="1.5"
                opacity="0.25"
              />
              <Path
                d="M120,0 L80,100 M150,30 L50,70 M150,70 L50,30 M120,100 L80,0"
                fill="none"
                stroke={IMPERIAL.border}
                strokeWidth="1"
                opacity="0.15"
              />
              {/* Decorative nodes */}
              <Path
                d="M100,50 L120,70 L100,90 L80,70 Z"
                fill="none"
                stroke={IMPERIAL.gold}
                strokeWidth="0.5"
                opacity="0.1"
              />
            </G>

            {/* Additional overlapping patterns for richness */}
            <G transform="translate(60, 60) scale(0.5)">
              <Path
                d="M120,0 L150,30 L150,70 L120,100 L80,100 L50,70 L50,30 L80,0 Z"
                fill="none"
                stroke={IMPERIAL.border}
                strokeWidth="1.5"
                opacity="0.25"
              />
            </G>
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#geometric)" />
      </Svg>
    </View>
  );
}
