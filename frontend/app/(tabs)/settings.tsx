import GoldenEagle from '@/components/icons/GoldenEagle';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { IMPERIAL } from '@/lib/theme';
import {
  ChevronLeftIcon,
  UserIcon,
  BellIcon,
  ShieldIcon,
  CircleHelpIcon,
  LogOutIcon,
  PaletteIcon,
  GlobeIcon,
  KeyIcon,
  SmartphoneIcon,
  BrainCircuitIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  XIcon,
  SaveIcon,
  DatabaseIcon,
  CreditCardIcon,
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PROVIDER_KEYS = [
  {
    provider: 'Supabase',
    envKey: 'SUPABASE_URL',
    label: 'Supabase URL',
    placeholder: 'https://your-project.supabase.co',
  },
  {
    provider: 'Supabase',
    envKey: 'SUPABASE_ANON_KEY',
    label: 'Supabase Anon Key',
    placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
  {
    provider: 'Stripe',
    envKey: 'STRIPE_SECRET_KEY',
    label: 'Stripe Secret Key',
    placeholder: 'sk_test_...',
  },
  { provider: 'OpenAI', envKey: 'OPENAI_API_KEY', label: 'OpenAI API Key', placeholder: 'sk-...' },
  // Messaging Platforms
  { provider: 'Telegram', envKey: 'TELEGRAM_BOT_TOKEN', label: 'Telegram Bot Token', placeholder: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz' },
  { provider: 'WhatsApp', envKey: 'WHATSAPP_FROM_NUMBER', label: 'WhatsApp From Number', placeholder: '+1234567890' },
  { provider: 'Messenger', envKey: 'MESSENGER_PAGE_ACCESS_TOKEN', label: 'Messenger Page Token', placeholder: 'EAAC...' },
  { provider: 'Messenger', envKey: 'MESSENGER_PAGE_ID', label: 'Messenger Page ID', placeholder: '123456789' },
  { provider: 'LINE', envKey: 'LINE_CHANNEL_ACCESS_TOKEN', label: 'LINE Channel Access Token', placeholder: 'AbCdEfGh...' },
  { provider: 'LINE', envKey: 'LINE_CHANNEL_SECRET', label: 'LINE Channel Secret', placeholder: 'secret...' },
  { provider: 'Discord', envKey: 'DISCORD_BOT_TOKEN', label: 'Discord Bot Token', placeholder: 'MTEwNTc...' },
  // Expo
  { provider: 'Expo', envKey: 'EXPO_ACCESS_TOKEN', label: 'Expo Access Token', placeholder: 'your-expo-token' },
  { provider: 'Expo', envKey: 'EXPO_PROJECT_SLUG', label: 'Expo Project Slug', placeholder: 'your-app-slug' },
];

const settingsGroups = [
  {
    title: 'تكاملات حقيقية',
    items: [
      {
        icon: DatabaseIcon,
        label: 'إعدادات Supabase',
        subtitle: 'ربط قاعدة البيانات والمصادقة',
        action: 'apikeys',
      },
      {
        icon: CreditCardIcon,
        label: 'إعدادات Stripe',
        subtitle: 'ربط بوابة المدفوعات الحقيقية',
        action: 'apikeys',
      },
      {
        icon: BrainCircuitIcon,
        label: 'إعدادات OpenAI',
        subtitle: 'ربط محرك الذكاء الاصطناعي',
        action: 'apikeys',
      },
    ],
  },
  {
    title: 'منصات المراسلة',
    items: [
      {
        icon: SmartphoneIcon,
        label: 'Telegram',
        subtitle: 'بوت الذكاء الاصطناعي على تيليجرام',
        action: 'apikeys',
        badge: 'جديد',
      },
      {
        icon: SmartphoneIcon,
        label: 'WhatsApp',
        subtitle: 'الذكاء الاصطناعي على واتساب',
        action: 'apikeys',
        badge: 'قريباً',
      },
      {
        icon: SmartphoneIcon,
        label: 'Messenger',
        subtitle: 'الذكاء الاصطناعي على ماسنجر',
        action: 'apikeys',
        badge: 'قريباً',
      },
      {
        icon: SmartphoneIcon,
        label: 'LINE',
        subtitle: 'الذكاء الاصطناعي على لاين',
        action: 'apikeys',
        badge: 'قريباً',
      },
      {
        icon: SmartphoneIcon,
        label: 'Discord',
        subtitle: 'الذكاء الاصطناعي على ديسكورد',
        action: 'apikeys',
        badge: 'جديد',
      },
    ],
  },
  {
    title: 'نشر التطبيقات',
    items: [
      {
        icon: SmartphoneIcon,
        label: 'Expo EAS',
        subtitle: 'نشر التطبيقات على متجر التطبيقات',
        action: 'apikeys',
        badge: 'جديد',
      },
    ],
  },
  {
    title: 'الحساب',
    items: [
      { icon: UserIcon, label: 'الملف الشخصي', subtitle: 'الاسم، البريد الإلكتروني' },
      { icon: ShieldIcon, label: 'المصادقة الثنائية', subtitle: '2FA · OAuth2', badge: 'مفعّل' },
    ],
  },
  {
    title: 'التفضيلات',
    items: [
      { icon: BellIcon, label: 'الإشعارات', subtitle: 'إشعارات الدفع والبريد' },
      { icon: PaletteIcon, label: 'المظهر', subtitle: 'الثيم السوري الجديد' },
      { icon: GlobeIcon, label: 'اللغة', subtitle: 'العربية' },
    ],
  },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [showApiKeysModal, setShowApiKeysModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [tempKeys, setTempKeys] = useState<Record<string, string>>({});
  const { apiKeys, setApiKey, removeApiKey, loadSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const openApiKeys = () => {
    setTempKeys({ ...apiKeys });
    setShowApiKeysModal(true);
  };

  const saveApiKeys = () => {
    for (const pk of PROVIDER_KEYS) {
      const val = tempKeys[pk.envKey]?.trim();
      if (val) {
        setApiKey(pk.envKey, val);
      } else if (apiKeys[pk.envKey]) {
        removeApiKey(pk.envKey);
      }
    }
    setShowApiKeysModal(false);
    if (Platform.OS === 'web') {
      // silent
    } else {
      Alert.alert('تم الحفظ', 'تم حفظ الإعدادات الحقيقية بنجاح');
    }
  };

  const toggleKeyVisibility = (key: string) => {
    setVisibleKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleItemPress = (action?: string) => {
    if (action === 'apikeys') openApiKeys();
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: IMPERIAL.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: IMPERIAL.gold, textAlign: 'right' }}>
          الإعدادات الحقيقية
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <View
          style={{
            backgroundColor: IMPERIAL.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
          <ChevronLeftIcon size={18} color={IMPERIAL.textTertiary} />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: IMPERIAL.text }}>
              مستخدم سوريا AI
            </Text>
            <Text style={{ fontSize: 12, color: IMPERIAL.textTertiary }}>user@syria-ai.com</Text>
          </View>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: IMPERIAL.accent,
              borderWidth: 1,
              borderColor: IMPERIAL.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <GoldenEagle size={30} />
          </View>
        </View>
      </View>

      {settingsGroups.map((group) => (
        <View key={group.title} style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: IMPERIAL.gold,
              textAlign: 'right',
              marginBottom: 8,
              paddingRight: 4,
            }}>
            {group.title}
          </Text>
          <View
            style={{
              backgroundColor: IMPERIAL.card,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: IMPERIAL.border,
              overflow: 'hidden',
            }}>
            {group.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.7}
                  onPress={() =>
                    handleItemPress(
                      'action' in item ? (item as { action?: string }).action : undefined
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    gap: 10,
                    borderBottomWidth: index < group.items.length - 1 ? 1 : 0,
                    borderBottomColor: IMPERIAL.border,
                  }}>
                  <ChevronLeftIcon size={16} color={IMPERIAL.textTertiary} />
                  {'badge' in item && item.badge && (
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                        backgroundColor: 'rgba(74, 222, 128, 0.15)',
                      }}>
                      <Text style={{ fontSize: 10, fontWeight: '600', color: IMPERIAL.success }}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: IMPERIAL.text }}>
                      {item.label}
                    </Text>
                    <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary, marginTop: 1 }}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <Icon size={18} color={IMPERIAL.gold} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            backgroundColor: IMPERIAL.card,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: 'rgba(239, 68, 68, 0.3)',
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#EF4444' }}>تسجيل الخروج</Text>
          <LogOutIcon size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: 12 }}>
        <GoldenEagle size={24} />
        <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary, marginTop: 4 }}>
          سوريا AI v1.0.0
        </Text>
      </View>

      <Modal visible={showApiKeysModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: IMPERIAL.cardSolid,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '85%',
              borderWidth: 1,
              borderColor: IMPERIAL.border,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: IMPERIAL.border,
              }}>
              <TouchableOpacity onPress={() => setShowApiKeysModal(false)}>
                <XIcon size={20} color={IMPERIAL.textTertiary} />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: '700', color: IMPERIAL.gold }}>
                إعدادات التكامل الحقيقي
              </Text>
              <TouchableOpacity onPress={saveApiKeys}>
                <SaveIcon size={20} color={IMPERIAL.success} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ padding: 16 }}
              contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: IMPERIAL.textTertiary,
                  textAlign: 'right',
                  marginBottom: 16,
                  lineHeight: 20,
                }}>
                أدخل بيانات الربط الحقيقية لمشاريعك. هذه البيانات تُستخدم لتفعيل الوظائف الحقيقية في التطبيق.
              </Text>

              {PROVIDER_KEYS.map((pk) => (
                <View key={pk.envKey} style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: IMPERIAL.text,
                      textAlign: 'right',
                      marginBottom: 8,
                    }}>
                    {pk.label}
                  </Text>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: IMPERIAL.border,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                    }}>
                    <TouchableOpacity onPress={() => toggleKeyVisibility(pk.envKey)}>
                      {visibleKeys[pk.envKey] ? (
                        <EyeOffIcon size={16} color={IMPERIAL.textTertiary} />
                      ) : (
                        <EyeIcon size={16} color={IMPERIAL.textTertiary} />
                      )}
                    </TouchableOpacity>
                    <TextInput
                      value={tempKeys[pk.envKey] || ''}
                      onChangeText={(val) => setTempKeys((prev) => ({ ...prev, [pk.envKey]: val }))}
                      placeholder={pk.placeholder}
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      secureTextEntry={!visibleKeys[pk.envKey]}
                      style={{
                        flex: 1,
                        height: 44,
                        color: IMPERIAL.text,
                        fontSize: 14,
                        textAlign: 'left',
                      }}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
