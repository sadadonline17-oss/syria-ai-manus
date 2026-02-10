import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface GoldenEagleProps {
  size?: number;
  glow?: boolean;
  animated?: boolean;
  pulseGlow?: boolean;
}

/**
 * Syria AI - New Visual Identity Logo (2026)
 * Represents the new Syrian Eagle with three stars, simplified and modern.
 */
export default function GoldenEagle({
  size = 120,
  glow = false,
  animated = false,
  pulseGlow = false,
}: GoldenEagleProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.18)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    if (pulseGlow) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.35,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [animated, glowAnim, pulseGlow, scaleAnim]);

  const SvgComponent = animated ? AnimatedSvg : Svg;
  const animStyle = animated ? { transform: [{ scale: scaleAnim }] } : undefined;

  return (
    <SvgComponent width={size} height={size} viewBox="0 0 200 120" style={animStyle}>
      <Defs>
        <LinearGradient id="syrianGold" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#D4AF37" />
          <Stop offset="0.5" stopColor="#F5E6A3" />
          <Stop offset="1" stopColor="#B8860B" />
        </LinearGradient>
        <RadialGradient id="logoGlow" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#D4AF37" stopOpacity="0.3" />
          <Stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {glow && (
        <Circle cx="100" cy="60" r="60" fill="url(#logoGlow)" />
      )}

      <G transform="translate(10, 10) scale(0.9)">
        {/* The New Syrian Eagle - Stylized Silhouette based on 2026 Identity */}
        <Path
          d="M90,30 C90,30 85,25 80,30 C75,35 70,50 70,50 L50,45 C40,42 20,45 10,60 C0,75 10,95 30,90 C40,88 55,75 60,70 L75,85 L85,95 L90,85 L95,95 L105,85 L120,70 C125,75 140,88 150,90 C170,95 180,75 170,60 C160,45 140,42 130,45 L110,50 C110,50 105,35 100,30 C95,25 90,30 90,30 Z"
          fill="url(#syrianGold)"
        />
        
        {/* Wings detail */}
        <Path
          d="M20,65 L55,55 M160,65 L125,55"
          stroke="#B8860B"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Three Stars above the eagle */}
        <G transform="translate(90, 5)">
           {/* Star 1 */}
           <Path d="M0,0 L1.5,4 L6,4 L2.5,7 L4,11 L0,8.5 L-4,11 L-2.5,7 L-6,4 L-1.5,4 Z" fill="#D4AF37" />
           {/* Star 2 */}
           <Path d="M-15,5 L-13.5,9 L-9,9 L-12.5,12 L-11,16 L-15,13.5 L-19,16 L-17.5,12 L-21,9 L-16.5,9 Z" fill="#D4AF37" />
           {/* Star 3 */}
           <Path d="M15,5 L16.5,9 L21,9 L17.5,12 L19,16 L15,13.5 L11,16 L12.5,12 L9,9 L13.5,9 Z" fill="#D4AF37" />
        </G>
      </G>
    </SvgComponent>
  );
}
