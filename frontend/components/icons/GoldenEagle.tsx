import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

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

      {glow && <Circle cx="100" cy="60" r="60" fill="url(#logoGlow)" />}

      <G transform="translate(10, 10) scale(0.9)">
        {/* Enhanced Hawk of Quraish - Detailed and Majestic */}
        <Path
          d="M100,25 C100,25 95,20 85,25 C75,30 70,45 70,45 L40,40 C30,38 10,45 5,65 C0,85 15,105 40,100 C55,97 70,80 75,75 L80,90 L90,105 L100,90 L110,105 L120,90 L125,75 C130,80 145,97 160,100 C185,105 200,85 195,65 C190,45 170,38 160,40 L130,45 C130,45 125,30 115,25 C105,20 100,25 100,25 Z"
          fill="url(#syrianGold)"
        />

        {/* Wing Feathers Detail */}
        <Path
          d="M30,70 L60,60 M170,70 L140,60 M25,80 L55,70 M175,80 L145,70"
          stroke="#B8860B"
          strokeWidth="1.5"
          opacity="0.4"
        />

        {/* Central Shield or Detail */}
        <Path d="M90,50 Q100,45 110,50 L105,80 Q100,85 95,80 Z" fill="#B8860B" opacity="0.3" />

        {/* Three Stars - Positioned and styled like the image */}
        <G transform="translate(100, 0)">
          {/* Star 1 (Center) */}
          <Path d="M0,0 L2,5 L8,5 L3,8 L5,14 L0,10 L-5,14 L-3,8 L-8,5 L-2,5 Z" fill="#D4AF37" />
          {/* Star 2 (Left) */}
          <Path
            d="M-22,8 L-20,13 L-14,13 L-19,16 L-17,22 L-22,18 L-27,22 L-25,16 L-30,13 L-24,13 Z"
            fill="#D4AF37"
          />
          {/* Star 3 (Right) */}
          <Path
            d="M22,8 L24,13 L30,13 L25,16 L27,22 L22,18 L17,22 L19,16 L14,13 L20,13 Z"
            fill="#D4AF37"
          />
        </G>
      </G>
    </SvgComponent>
  );
}
