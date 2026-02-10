import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, RadialGradient, Ellipse, Rect } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface GoldenEagleProps {
  size?: number;
  glow?: boolean;
  animated?: boolean;
  pulseGlow?: boolean;
}

export default function GoldenEagle({ size = 120, glow = false, animated = false, pulseGlow = false }: GoldenEagleProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.15)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.06, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ).start();
    }
    if (pulseGlow) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 0.4, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0.08, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        ]),
      ).start();
    }
  }, [animated, pulseGlow]);

  const SvgComponent = animated ? AnimatedSvg : Svg;
  const animStyle = animated ? { transform: [{ scale: scaleAnim }] } : undefined;

  return (
    <SvgComponent width={size} height={size} viewBox="0 0 200 200" style={animStyle}>
      <Defs>
        <LinearGradient id="eagleGold" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#faf0c8" />
          <Stop offset="0.15" stopColor="#f5e6a3" />
          <Stop offset="0.35" stopColor="#e8d48b" />
          <Stop offset="0.55" stopColor="#d4af37" />
          <Stop offset="0.75" stopColor="#c9a02e" />
          <Stop offset="1" stopColor="#8b7335" />
        </LinearGradient>
        <LinearGradient id="eagleShine" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#fffaed" />
          <Stop offset="0.3" stopColor="#fff8dc" />
          <Stop offset="0.6" stopColor="#f5e6a3" />
          <Stop offset="1" stopColor="#d4af37" />
        </LinearGradient>
        <LinearGradient id="wingGold" x1="0" y1="0" x2="1" y2="0.5">
          <Stop offset="0" stopColor="#a07d25" />
          <Stop offset="0.2" stopColor="#b8922a" />
          <Stop offset="0.5" stopColor="#d4af37" />
          <Stop offset="0.8" stopColor="#e8d48b" />
          <Stop offset="1" stopColor="#d4af37" />
        </LinearGradient>
        <LinearGradient id="bodyGold" x1="0.5" y1="0" x2="0.5" y2="1">
          <Stop offset="0" stopColor="#faf0c8" />
          <Stop offset="0.2" stopColor="#f5e6a3" />
          <Stop offset="0.4" stopColor="#e8d48b" />
          <Stop offset="0.65" stopColor="#d4af37" />
          <Stop offset="1" stopColor="#9a7b2b" />
        </LinearGradient>
        <RadialGradient id="glowBg" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#d4af37" stopOpacity="0.25" />
          <Stop offset="0.3" stopColor="#d4af37" stopOpacity="0.12" />
          <Stop offset="0.6" stopColor="#d4af37" stopOpacity="0.05" />
          <Stop offset="0.85" stopColor="#d4af37" stopOpacity="0.02" />
          <Stop offset="1" stopColor="#d4af37" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="shieldGold" x1="0.5" y1="0" x2="0.5" y2="1">
          <Stop offset="0" stopColor="#faf0c8" />
          <Stop offset="0.35" stopColor="#f5e6a3" />
          <Stop offset="0.65" stopColor="#d4af37" />
          <Stop offset="1" stopColor="#8b7335" />
        </LinearGradient>
        <LinearGradient id="starGreen" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#00e676" />
          <Stop offset="0.5" stopColor="#00c853" />
          <Stop offset="1" stopColor="#007A3D" />
        </LinearGradient>
        <LinearGradient id="crownGold" x1="0.5" y1="0" x2="0.5" y2="1">
          <Stop offset="0" stopColor="#fffaed" />
          <Stop offset="0.3" stopColor="#fff8dc" />
          <Stop offset="0.6" stopColor="#f5e6a3" />
          <Stop offset="1" stopColor="#d4af37" />
        </LinearGradient>
        <RadialGradient id="eyeGlow" cx="0.5" cy="0.4" r="0.5">
          <Stop offset="0" stopColor="#fffaed" stopOpacity="0.95" />
          <Stop offset="0.5" stopColor="#fff8dc" stopOpacity="0.4" />
          <Stop offset="1" stopColor="#d4af37" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="outerRing" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#f5e6a3" />
          <Stop offset="0.5" stopColor="#d4af37" />
          <Stop offset="1" stopColor="#8b7335" />
        </LinearGradient>
        <RadialGradient id="innerGlow" cx="0.5" cy="0.45" r="0.45">
          <Stop offset="0" stopColor="#d4af37" stopOpacity="0.08" />
          <Stop offset="1" stopColor="#d4af37" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="syriaRed" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ff2d3b" />
          <Stop offset="1" stopColor="#CE1126" />
        </LinearGradient>
      </Defs>

      {glow && <Circle cx="100" cy="100" r="99" fill="url(#glowBg)" />}

      <Circle cx="100" cy="100" r="95" fill="none" stroke="url(#outerRing)" strokeWidth="2" opacity="0.7" />
      <Circle cx="100" cy="100" r="92" fill="none" stroke="url(#outerRing)" strokeWidth="0.6" opacity="0.2" />
      <Circle cx="100" cy="100" r="88" fill="url(#innerGlow)" />

      <G>
        <Path d="M85 36 L88 27 L92 34 L96 24 L100 22 L104 24 L108 34 L112 27 L115 36 L108 39 L100 37 L92 39Z" fill="url(#crownGold)" opacity="0.95" />
        <Circle cx="88" cy="27" r="2" fill="#fffaed" opacity="0.9" />
        <Circle cx="100" cy="22" r="2.5" fill="#fffaed" opacity="1" />
        <Circle cx="112" cy="27" r="2" fill="#fffaed" opacity="0.9" />
        <Path d="M96 24 L100 22 L104 24" fill="none" stroke="#fff8dc" strokeWidth="0.5" opacity="0.5" />
      </G>

      <G>
        <Path d="M54 70 Q46 55 40 62 Q35 69 46 76 L54 70Z" fill="url(#wingGold)" opacity="0.95" />
        <Path d="M48 78 Q38 64 33 72 Q29 80 41 84 L48 78Z" fill="url(#wingGold)" opacity="0.88" />
        <Path d="M44 86 Q32 74 28 82 Q25 90 37 92 L44 86Z" fill="url(#wingGold)" opacity="0.78" />
        <Path d="M41 94 Q27 84 24 92 Q22 100 34 100 L41 94Z" fill="url(#wingGold)" opacity="0.68" />
        <Path d="M39 102 Q24 94 22 101 Q20 108 31 107 L39 102Z" fill="url(#wingGold)" opacity="0.55" />
      </G>

      <G>
        <Path d="M146 70 Q154 55 160 62 Q165 69 154 76 L146 70Z" fill="url(#wingGold)" opacity="0.95" />
        <Path d="M152 78 Q162 64 167 72 Q171 80 159 84 L152 78Z" fill="url(#wingGold)" opacity="0.88" />
        <Path d="M156 86 Q168 74 172 82 Q175 90 163 92 L156 86Z" fill="url(#wingGold)" opacity="0.78" />
        <Path d="M159 94 Q173 84 176 92 Q178 100 166 100 L159 94Z" fill="url(#wingGold)" opacity="0.68" />
        <Path d="M161 102 Q176 94 178 101 Q180 108 169 107 L161 102Z" fill="url(#wingGold)" opacity="0.55" />
      </G>

      <G>
        <Path d="M100 36 Q89 36 83 43 Q77 50 75 58 L79 63 Q86 51 93 47 L100 45 L107 47 Q114 51 121 63 L125 58 Q123 50 117 43 Q111 36 100 36Z" fill="url(#bodyGold)" />
        <Ellipse cx="100" cy="41" rx="9" ry="3.5" fill="url(#eagleShine)" opacity="0.25" />
      </G>

      <G>
        <Path d="M75 58 L71 64 Q67 70 59 74 L55 76 Q57 83 63 85 Q69 80 73 76 L79 70 L83 64 L79 63Z" fill="url(#eagleGold)" />
        <Path d="M125 58 L129 64 Q133 70 141 74 L145 76 Q143 83 137 85 Q131 80 127 76 L121 70 L117 64 L121 63Z" fill="url(#eagleGold)" />
        <Path d="M63 85 Q59 93 57 101 Q55 109 59 115 L65 111 Q63 103 65 95 L69 87Z" fill="url(#wingGold)" opacity="0.92" />
        <Path d="M137 85 Q141 93 143 101 Q145 109 141 115 L135 111 Q137 103 135 95 L131 87Z" fill="url(#wingGold)" opacity="0.92" />
      </G>

      <G>
        <Path d="M83 64 Q85 72 87 80 L100 88 L113 80 Q115 72 117 64 L111 58 Q107 53 100 51 Q93 53 89 58Z" fill="url(#bodyGold)" />
        <Ellipse cx="100" cy="60" rx="10" ry="4" fill="url(#eagleShine)" opacity="0.15" />
      </G>

      <G>
        <Circle cx="91" cy="66" r="4" fill="#061818" />
        <Circle cx="109" cy="66" r="4" fill="#061818" />
        <Circle cx="91" cy="66" r="5.5" fill="url(#eyeGlow)" opacity="0.35" />
        <Circle cx="109" cy="66" r="5.5" fill="url(#eyeGlow)" opacity="0.35" />
        <Circle cx="92" cy="64.5" r="1.5" fill="#fffaed" />
        <Circle cx="110" cy="64.5" r="1.5" fill="#fffaed" />
        <Circle cx="90.5" cy="66.5" r="0.6" fill="#fff8dc" opacity="0.7" />
        <Circle cx="108.5" cy="66.5" r="0.6" fill="#fff8dc" opacity="0.7" />
        <Circle cx="93" cy="67.5" r="0.4" fill="#fff8dc" opacity="0.4" />
        <Circle cx="111" cy="67.5" r="0.4" fill="#fff8dc" opacity="0.4" />
      </G>

      <G>
        <Path d="M95 74 L100 86 L105 74 Q103 77 100 77 Q97 77 95 74Z" fill="url(#shieldGold)" />
        <Path d="M97 74.5 L100 81 L103 74.5" fill="none" stroke="#8b7335" strokeWidth="0.4" opacity="0.5" />
        <Path d="M99 76 L100 78 L101 76" fill="url(#eagleShine)" opacity="0.3" />
      </G>

      <G>
        <Path d="M87 80 L100 88 L113 80 L111 98 L107 112 L100 116 L93 112 L89 98Z" fill="url(#bodyGold)" opacity="0.95" />
        <Path d="M94 88 Q100 91 106 88" fill="none" stroke="url(#eagleShine)" strokeWidth="0.6" opacity="0.35" />
        <Path d="M93 94 Q100 97 107 94" fill="none" stroke="url(#eagleShine)" strokeWidth="0.5" opacity="0.25" />
        <Path d="M94 100 Q100 102 106 100" fill="none" stroke="url(#eagleShine)" strokeWidth="0.4" opacity="0.2" />
      </G>

      <G>
        <Path d="M77 103 Q73 111 71 119 Q69 127 73 131 L79 128 Q77 121 79 113 L83 107Z" fill="url(#wingGold)" opacity="0.88" />
        <Path d="M123 103 Q127 111 129 119 Q131 127 127 131 L121 128 Q123 121 121 113 L117 107Z" fill="url(#wingGold)" opacity="0.88" />
        <Path d="M65 111 Q61 119 63 123 L69 121 Q69 115 71 111Z" fill="url(#wingGold)" opacity="0.72" />
        <Path d="M135 111 Q139 119 137 123 L131 121 Q131 115 129 111Z" fill="url(#wingGold)" opacity="0.72" />
      </G>

      <G>
        <Path d="M83 116 Q85 122 89 128 L100 134 L111 128 Q115 122 117 116 L111 112 L100 116 L89 112Z" fill="url(#wingGold)" opacity="0.82" />
        <Path d="M89 128 Q83 134 77 138 Q73 140 75 144 Q79 146 85 142 L93 136 L100 134 L107 136 L115 142 Q121 146 125 144 Q127 140 123 138 Q117 134 111 128Z" fill="url(#eagleGold)" opacity="0.78" />
        <Path d="M77 138 Q71 142 67 144 Q64 146 66 149 Q70 150 76 147 L83 142Z" fill="url(#wingGold)" opacity="0.55" />
        <Path d="M123 138 Q129 142 133 144 Q136 146 134 149 Q130 150 124 147 L117 142Z" fill="url(#wingGold)" opacity="0.55" />
      </G>

      <G>
        <Path d="M82 148 Q90 155 100 157 Q110 155 118 148" fill="none" stroke="url(#shieldGold)" strokeWidth="3" opacity="0.75" strokeLinecap="round" />
        <Path d="M86 152 Q93 158 100 159 Q107 158 114 152" fill="none" stroke="url(#shieldGold)" strokeWidth="1.8" opacity="0.45" strokeLinecap="round" />
      </G>

      <G>
        <Path d="M89 165 L91.5 157 L94 165 L89 161 L94 161Z" fill="url(#starGreen)" opacity="0.9" />
        <Path d="M96 167 L99 159 L102 167 L96 163 L102 163Z" fill="url(#starGreen)" opacity="1" />
        <Path d="M104 165 L106.5 157 L109 165 L104 161 L109 161Z" fill="url(#starGreen)" opacity="0.9" />
      </G>

      <G>
        <Path d="M78 149 Q82 152 87 152" fill="none" stroke="url(#syriaRed)" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
        <Path d="M122 149 Q118 152 113 152" fill="none" stroke="url(#syriaRed)" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      </G>

      <G opacity="0.3">
        <Circle cx="28" cy="100" r="1.8" fill="url(#eagleGold)" />
        <Circle cx="172" cy="100" r="1.8" fill="url(#eagleGold)" />
        <Circle cx="100" cy="18" r="1.8" fill="url(#eagleGold)" />
        <Circle cx="100" cy="182" r="1.8" fill="url(#eagleGold)" />
        <Circle cx="40" cy="56" r="1.2" fill="url(#eagleGold)" />
        <Circle cx="160" cy="56" r="1.2" fill="url(#eagleGold)" />
        <Circle cx="40" cy="144" r="1.2" fill="url(#eagleGold)" />
        <Circle cx="160" cy="144" r="1.2" fill="url(#eagleGold)" />
        <Circle cx="56" cy="36" r="0.8" fill="url(#eagleGold)" />
        <Circle cx="144" cy="36" r="0.8" fill="url(#eagleGold)" />
        <Circle cx="56" cy="164" r="0.8" fill="url(#eagleGold)" />
        <Circle cx="144" cy="164" r="0.8" fill="url(#eagleGold)" />
      </G>

      <G opacity="0.08">
        <Path d="M30 100 Q65 85 100 95 Q135 85 170 100" fill="none" stroke="url(#eagleGold)" strokeWidth="0.5" />
        <Path d="M30 100 Q65 115 100 105 Q135 115 170 100" fill="none" stroke="url(#eagleGold)" strokeWidth="0.5" />
      </G>
    </SvgComponent>
  );
}
