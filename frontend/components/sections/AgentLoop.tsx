import { IMPERIAL } from '@/lib/theme';
import {
  CheckCircleIcon,
  CircleIcon,
  SearchIcon,
  CodeIcon,
  TestTubeIcon,
  ScanEyeIcon,
  SparklesIcon,
  RocketIcon,
  BrainCircuitIcon,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';

const stages = [
  {
    key: 'plan',
    label: 'التخطيط',
    labelEn: 'Plan',
    icon: BrainCircuitIcon,
    color: IMPERIAL.agent.planning,
  },
  {
    key: 'research',
    label: 'البحث',
    labelEn: 'Research',
    icon: SearchIcon,
    color: IMPERIAL.agent.researching,
  },
  { key: 'code', label: 'البرمجة', labelEn: 'Code', icon: CodeIcon, color: IMPERIAL.agent.coding },
  {
    key: 'test',
    label: 'الاختبار',
    labelEn: 'Test',
    icon: TestTubeIcon,
    color: IMPERIAL.agent.testing,
  },
  {
    key: 'review',
    label: 'المراجعة',
    labelEn: 'Review',
    icon: ScanEyeIcon,
    color: IMPERIAL.agent.reviewing,
  },
  {
    key: 'refine',
    label: 'التحسين',
    labelEn: 'Refine',
    icon: SparklesIcon,
    color: IMPERIAL.agent.refining,
  },
  {
    key: 'deploy',
    label: 'النشر',
    labelEn: 'Deploy',
    icon: RocketIcon,
    color: IMPERIAL.agent.deploying,
  },
];

interface AgentLoopProps {
  activeStage?: number;
  autoAnimate?: boolean;
}

export default function AgentLoop({
  activeStage: initialStage = 2,
  autoAnimate = true,
}: AgentLoopProps) {
  const [activeStage, setActiveStage] = useState(initialStage);
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    if (autoAnimate) {
      const interval = setInterval(() => {
        setActiveStage((prev) => (prev + 1) % stages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoAnimate, pulseAnim]);

  return (
    <View style={{ marginTop: 32, paddingHorizontal: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
              backgroundColor: `${stages[activeStage].color}20`,
            }}>
            <Text style={{ fontSize: 10, color: stages[activeStage].color, fontWeight: '600' }}>
              {stages[activeStage].labelEn}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 18, fontWeight: '700', color: IMPERIAL.gold }}>
          محرك Agent Loop
        </Text>
      </View>
      <Text
        style={{
          fontSize: 12,
          color: IMPERIAL.textTertiary,
          marginBottom: 16,
          textAlign: 'right',
        }}>
        7 مراحل ذكية لتنفيذ مهامك بدقة
      </Text>

      <View
        style={{
          backgroundColor: IMPERIAL.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: IMPERIAL.border,
          padding: 14,
          gap: 4,
        }}>
        {stages.map((stage, index) => {
          const isCompleted = index < activeStage;
          const isActive = index === activeStage;
          const StageIcon = stage.icon;

          return (
            <Animated.View
              key={stage.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 10,
                backgroundColor: isActive ? `${stage.color}15` : 'transparent',
                borderWidth: isActive ? 1 : 0,
                borderColor: `${stage.color}40`,
                opacity: isActive
                  ? pulseAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.85, 1] })
                  : 1,
              }}>
              {isCompleted ? (
                <CheckCircleIcon size={16} color={IMPERIAL.success} />
              ) : isActive ? (
                <Animated.View style={{ opacity: pulseAnim }}>
                  <StageIcon size={16} color={stage.color} />
                </Animated.View>
              ) : (
                <CircleIcon size={16} color={IMPERIAL.textTertiary} />
              )}

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 10,
                    color: isActive ? stage.color : IMPERIAL.textTertiary,
                    fontWeight: '500',
                  }}>
                  {stage.labelEn}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? '700' : '500',
                    color: isCompleted
                      ? IMPERIAL.success
                      : isActive
                        ? stage.color
                        : IMPERIAL.textTertiary,
                  }}>
                  {stage.label}
                </Text>
              </View>

              <View
                style={{
                  width: 40,
                  height: 3,
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                }}>
                <View
                  style={{
                    width: isCompleted ? '100%' : isActive ? '60%' : '0%',
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: isCompleted
                      ? IMPERIAL.success
                      : isActive
                        ? stage.color
                        : 'transparent',
                  }}
                />
              </View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
