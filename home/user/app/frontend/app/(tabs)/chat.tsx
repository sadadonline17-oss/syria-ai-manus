import GoldenEagle from '@/components/icons/GoldenEagle';
import { IMPERIAL } from '@/lib/theme';
import { ArrowUpIcon, PlusIcon, SparklesIcon } from 'lucide-react-native';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant';
}

export default function ChatScreen() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: inputValue.trim(), role: 'user' };
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: 'أنا سوريا AI، مساعدك الذكي. هذا رد تجريبي على رسالتك.',
      role: 'assistant',
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputValue('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`px-4 py-2 ${item.role === 'user' ? 'items-start' : 'items-end'}`}>
      {item.role === 'assistant' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, alignSelf: 'flex-end' }}>
          <Text style={{ fontSize: 11, color: IMPERIAL.gold, fontWeight: '600' }}>سوريا AI</Text>
          <GoldenEagle size={16} />
        </View>
      )}
      <View
        style={{
          maxWidth: '82%',
          backgroundColor: item.role === 'user' ? IMPERIAL.primary : IMPERIAL.glass,
          borderRadius: 18,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderWidth: 1,
          borderColor: item.role === 'user' ? IMPERIAL.gold : IMPERIAL.border,
          shadowColor: IMPERIAL.gold,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: item.role === 'assistant' ? 0.08 : 0,
          shadowRadius: 8,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            lineHeight: 24,
            color: item.role === 'user' ? IMPERIAL.primaryForeground : IMPERIAL.text,
            textAlign: 'right',
            writingDirection: 'rtl',
          }}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: IMPERIAL.background }}
    >
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: IMPERIAL.border,
          backgroundColor: IMPERIAL.glass,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SparklesIcon size={18} color={IMPERIAL.gold} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: IMPERIAL.gold }}>المحادثة</Text>
          <GoldenEagle size={24} />
        </View>
      </View>

      {messages.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <GoldenEagle size={60} />
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
              color: IMPERIAL.gold,
              textAlign: 'center',
              marginTop: 16,
            }}
          >
            ابدأ محادثة جديدة
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: IMPERIAL.textTertiary,
              textAlign: 'center',
              marginTop: 8,
              lineHeight: 22,
            }}
          >
            اسأل أي سؤال أو أسند مهمة للمساعد الذكي
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{ paddingVertical: 12 }}
        />
      )}

      <View style={{ paddingHorizontal: 12, paddingBottom: insets.bottom + 8, paddingTop: 8 }}>
        <View
          style={{
            backgroundColor: IMPERIAL.card,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 12,
            paddingVertical: 8,
            gap: 8,
          }}
        >
          <TouchableOpacity
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              borderWidth: 1,
              borderColor: IMPERIAL.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlusIcon size={18} color={IMPERIAL.textSecondary} />
          </TouchableOpacity>

          <TextInput
            placeholder="اكتب رسالتك..."
            placeholderTextColor={IMPERIAL.textTertiary}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={sendMessage}
            multiline
            style={{
              flex: 1,
              fontSize: 15,
              lineHeight: 22,
              color: IMPERIAL.text,
              maxHeight: 100,
              paddingVertical: 4,
              textAlign: 'right',
              writingDirection: 'rtl',
            }}
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputValue.trim()}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: inputValue.trim() ? IMPERIAL.primary : IMPERIAL.accent,
            }}
          >
            <ArrowUpIcon
              size={16}
              strokeWidth={3}
              color={inputValue.trim() ? IMPERIAL.primaryForeground : IMPERIAL.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
