import GoldenEagle from '@/components/icons/GoldenEagle';
import { IMPERIAL } from '@/lib/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('frahabw785@gmail.com');
  const [password, setPassword] = useState('Aa111991+');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // محاكاة عملية تسجيل دخول حقيقية مع Supabase باستخدام البيانات المزودة
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'frahabw785@gmail.com' && password === 'Aa111991+') {
        router.replace('/(tabs)');
      } else {
        Alert.alert('خطأ', 'بيانات الاعتماد غير صحيحة');
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: IMPERIAL.background }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          justifyContent: 'center',
          paddingTop: insets.top,
        }}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <GoldenEagle size={80} />
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: IMPERIAL.gold,
              marginTop: 16,
              textAlign: 'center',
            }}>
            تسجيل الدخول
          </Text>
          <Text style={{ fontSize: 14, color: IMPERIAL.textTertiary, marginTop: 8 }}>
            مرحباً بك في نظام سوريا AI الحقيقي
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <View>
            <Text style={{ color: IMPERIAL.gold, marginBottom: 8, textAlign: 'right' }}>
              البريد الإلكتروني
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@domain.com"
              placeholderTextColor="rgba(255,255,255,0.3)"
              style={{
                backgroundColor: IMPERIAL.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: IMPERIAL.border,
                padding: 14,
                color: IMPERIAL.text,
                textAlign: 'left',
              }}
            />
          </View>

          <View>
            <Text style={{ color: IMPERIAL.gold, marginBottom: 8, textAlign: 'right' }}>
              كلمة المرور
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
              style={{
                backgroundColor: IMPERIAL.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: IMPERIAL.border,
                padding: 14,
                color: IMPERIAL.text,
                textAlign: 'left',
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
            style={{
              backgroundColor: IMPERIAL.primary,
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              marginTop: 10,
              shadowColor: IMPERIAL.gold,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}>
            {isLoading ? (
              <ActivityIndicator color={IMPERIAL.primaryForeground} />
            ) : (
              <Text style={{ color: IMPERIAL.primaryForeground, fontSize: 16, fontWeight: '700' }}>
                دخول آمن
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30,
            gap: 8,
          }}>
          <TouchableOpacity>
            <Text style={{ color: IMPERIAL.gold, fontWeight: '600' }}>إنشاء حساب</Text>
          </TouchableOpacity>
          <Text style={{ color: IMPERIAL.textTertiary }}>ليس لديك حساب؟</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
