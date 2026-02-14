import GoldenEagle from '@/components/icons/GoldenEagle';
import IslamicPattern from '@/components/IslamicPattern';
import MarkdownRenderer from '@/components/chat/MarkdownRenderer';
import { useChat } from '@/lib/hooks/useChat';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { IMPERIAL } from '@/lib/theme';
import {
  ArrowUpIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
  SearchIcon,
  HistoryIcon,
  PlusCircleIcon,
  PaperclipIcon,
} from 'lucide-react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ChatMessage } from '@/lib/stores/chat-store';
import { BACKEND_URL } from '@/lib/api';

interface ProviderData {
  name: string;
  staticModels: { name: string; label: string; provider: string; maxTokenAllowed: number }[];
  hasDynamicModels: boolean;
  isEnabled: boolean;
}

export default function ChatScreen() {
  const [inputValue, setInputValue] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const {
    messages,
    isStreaming,
    sendMessage,
    clearMessages,
    sessions,
    activeSessionId,
    switchSession,
    deleteSession,
  } = useChat();
  const { selectedProvider, selectedModel, setSelectedProvider, setSelectedModel, loadSettings } =
    useSettingsStore();

  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/providers`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      const data = await res.json();
      setProviders(data.providers || []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadSettings();
    fetchProviders();
  }, [loadSettings, fetchProviders]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isStreaming) return;
    const text = inputValue;
    setInputValue('');
    sendMessage(text);
  }, [inputValue, isStreaming, sendMessage]);

  const handleNewChat = () => {
    clearMessages();
  };

  const currentProvider = providers.find((p) => p.name === selectedProvider);
  const currentModel = currentProvider?.staticModels.find((m) => m.name === selectedModel);

  const filteredProviders = providers
    .map((p) => ({
      ...p,
      staticModels: p.staticModels.filter(
        (m) =>
          !modelSearch ||
          m.label.toLowerCase().includes(modelSearch.toLowerCase()) ||
          m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
          p.name.toLowerCase().includes(modelSearch.toLowerCase())
      ),
    }))
    .filter((p) => p.staticModels.length > 0);

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <View
        style={{
          maxWidth: '85%',
          backgroundColor: item.role === 'user' ? IMPERIAL.background : IMPERIAL.primary,
          borderRadius: 15,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderWidth: item.role === 'user' ? 1.5 : 0,
          borderColor: IMPERIAL.gold,
          alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
          shadowColor: item.role === 'assistant' ? IMPERIAL.gold : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}>
        {item.role === 'assistant' && item.isStreaming && !item.content ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ActivityIndicator size="small" color={IMPERIAL.background} />
            <Text style={{ fontSize: 13, color: IMPERIAL.background, fontWeight: '500' }}>
              جاري التفكير...
            </Text>
          </View>
        ) : item.role === 'assistant' ? (
          <MarkdownRenderer content={item.content} color="#000" />
        ) : (
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22,
              color: IMPERIAL.gold,
              textAlign: 'left',
            }}>
            {item.content}
          </Text>
        )}
      </View>
    </View>
  );

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `منذ ${Math.floor(diff / 60000)} دقيقة`;
    if (diff < 86400000) return `منذ ${Math.floor(diff / 3600000)} ساعة`;
    return `منذ ${Math.floor(diff / 86400000)} يوم`;
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: IMPERIAL.background }}>
      <IslamicPattern />
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity style={{ padding: 4 }}>
            <View
              style={{ width: 22, height: 2, backgroundColor: IMPERIAL.gold, marginBottom: 5 }}
            />
            <View
              style={{ width: 22, height: 2, backgroundColor: IMPERIAL.gold, marginBottom: 5 }}
            />
            <View style={{ width: 16, height: 2, backgroundColor: IMPERIAL.gold }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNewChat}
            style={{
              borderWidth: 1,
              borderColor: IMPERIAL.gold,
              borderRadius: 25,
              paddingHorizontal: 14,
              paddingVertical: 7,
              backgroundColor: 'transparent',
            }}>
            <Text style={{ color: IMPERIAL.gold, fontSize: 14, fontWeight: '500' }}>New Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', flex: 1 }}>
          <GoldenEagle size={65} />
          <Text
            style={{
              color: IMPERIAL.gold,
              fontSize: 14,
              marginTop: 4,
              fontFamily: Platform.OS === 'web' ? 'Traditional Arabic, serif' : undefined,
            }}>
            الجمهورية العربية السورية
          </Text>
          <Text
            style={{
              color: IMPERIAL.gold,
              fontSize: 15,
              fontWeight: '400',
              fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : undefined,
            }}>
            Syrian Arab Republic
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <TouchableOpacity onPress={() => setShowHistory(true)}>
            <PlusIcon size={22} color={IMPERIAL.gold} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ color: IMPERIAL.gold, fontSize: 24, fontWeight: '400' }}>?</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <XIcon size={22} color={IMPERIAL.gold} />
          </TouchableOpacity>
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
            }}>
            ابدأ محادثة جديدة
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: IMPERIAL.textTertiary,
              textAlign: 'center',
              marginTop: 8,
              lineHeight: 22,
            }}>
            اسأل أي سؤال أو أسند مهمة للمساعد الذكي
          </Text>
          <View
            style={{
              marginTop: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: IMPERIAL.accent,
              borderWidth: 1,
              borderColor: IMPERIAL.border,
            }}>
            <Text style={{ fontSize: 11, color: IMPERIAL.textSecondary }}>
              {selectedProvider} · {currentModel?.label || selectedModel.split('/').pop()}
            </Text>
          </View>
          {sessions.length > 0 && (
            <TouchableOpacity
              onPress={() => setShowHistory(true)}
              style={{
                marginTop: 24,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: IMPERIAL.accent,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: IMPERIAL.border,
              }}>
              <Text style={{ fontSize: 13, color: IMPERIAL.gold, fontWeight: '600' }}>
                {sessions.length} محادثة سابقة
              </Text>
              <HistoryIcon size={16} color={IMPERIAL.gold} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{ paddingVertical: 12 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 12, paddingTop: 8 }}>
        <View
          style={{
            backgroundColor: 'transparent',
            borderRadius: 25,
            borderWidth: 1,
            borderColor: IMPERIAL.border,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 10,
            gap: 12,
          }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ color: IMPERIAL.textTertiary, fontSize: 14 }}>@ Add context</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Tell Same what you want"
            placeholderTextColor={IMPERIAL.textTertiary}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSend}
            editable={!isStreaming}
            style={{
              flex: 1,
              fontSize: 16,
              color: IMPERIAL.text,
              textAlign: 'left',
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity style={{ padding: 4 }}>
              <PaperclipIcon size={20} color={IMPERIAL.textTertiary} />
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 15,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{ color: IMPERIAL.gold, fontSize: 13, fontWeight: '500' }}>
                Agentic <Text style={{ color: '#a78bfa' }}>max</Text>
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputValue.trim() || isStreaming}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: IMPERIAL.gold,
              }}>
              {isStreaming ? (
                <ActivityIndicator size="small" color={IMPERIAL.background} />
              ) : (
                <ArrowUpIcon size={22} strokeWidth={3} color={IMPERIAL.background} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal visible={showModelPicker} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: IMPERIAL.cardSolid,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '75%',
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
              <TouchableOpacity
                onPress={() => {
                  setShowModelPicker(false);
                  setModelSearch('');
                }}>
                <XIcon size={20} color={IMPERIAL.textTertiary} />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: '700', color: IMPERIAL.gold }}>
                اختر النموذج
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: 16,
                marginTop: 12,
                marginBottom: 8,
                backgroundColor: IMPERIAL.card,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: IMPERIAL.border,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
              }}>
              <SearchIcon size={16} color={IMPERIAL.textTertiary} />
              <TextInput
                placeholder="ابحث عن نموذج..."
                placeholderTextColor={IMPERIAL.textTertiary}
                value={modelSearch}
                onChangeText={setModelSearch}
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: IMPERIAL.text,
                  paddingVertical: 10,
                  textAlign: 'right',
                  writingDirection: 'rtl',
                }}
              />
            </View>
            <ScrollView
              style={{ padding: 16 }}
              contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
              {filteredProviders.map((provider) => (
                <View key={provider.name} style={{ marginBottom: 16 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 8,
                      marginBottom: 8,
                    }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: IMPERIAL.gold }}>
                      {provider.name}
                    </Text>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: provider.isEnabled
                          ? IMPERIAL.success
                          : IMPERIAL.textTertiary,
                      }}
                    />
                  </View>
                  {provider.staticModels.map((model) => {
                    const isSelected =
                      selectedProvider === provider.name && selectedModel === model.name;
                    return (
                      <TouchableOpacity
                        key={model.name}
                        onPress={() => {
                          setSelectedProvider(provider.name);
                          setSelectedModel(model.name);
                          setShowModelPicker(false);
                          setModelSearch('');
                        }}
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          backgroundColor: isSelected ? IMPERIAL.accent : 'transparent',
                          borderWidth: isSelected ? 1 : 0,
                          borderColor: IMPERIAL.gold,
                          marginBottom: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: 8,
                        }}>
                        {isSelected && (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: IMPERIAL.success,
                            }}
                          />
                        )}
                        <Text
                          style={{
                            fontSize: 14,
                            color: isSelected ? IMPERIAL.gold : IMPERIAL.text,
                            fontWeight: isSelected ? '600' : '400',
                          }}>
                          {model.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
              {filteredProviders.length === 0 && (
                <Text
                  style={{
                    textAlign: 'center',
                    color: IMPERIAL.textTertiary,
                    fontSize: 14,
                    marginTop: 20,
                  }}>
                  لا توجد نتائج
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showHistory} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: IMPERIAL.cardSolid,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '70%',
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
              <TouchableOpacity onPress={() => setShowHistory(false)}>
                <XIcon size={20} color={IMPERIAL.textTertiary} />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: '700', color: IMPERIAL.gold }}>
                سجل المحادثات
              </Text>
              <TouchableOpacity
                onPress={() => {
                  handleNewChat();
                  setShowHistory(false);
                }}>
                <PlusCircleIcon size={20} color={IMPERIAL.gold} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ padding: 16 }}
              contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
              {sessions.length === 0 ? (
                <Text
                  style={{
                    textAlign: 'center',
                    color: IMPERIAL.textTertiary,
                    fontSize: 14,
                    marginTop: 20,
                  }}>
                  لا توجد محادثات سابقة
                </Text>
              ) : (
                sessions.map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    onPress={() => {
                      switchSession(session.id);
                      setShowHistory(false);
                    }}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      backgroundColor:
                        session.id === activeSessionId ? IMPERIAL.accent : 'transparent',
                      borderWidth: session.id === activeSessionId ? 1 : 0,
                      borderColor: IMPERIAL.gold,
                      marginBottom: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      style={{ padding: 4 }}>
                      <Trash2Icon size={14} color={IMPERIAL.error} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text
                        style={{ fontSize: 14, fontWeight: '600', color: IMPERIAL.text }}
                        numberOfLines={1}>
                        {session.title}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 4,
                        }}>
                        <Text style={{ fontSize: 11, color: IMPERIAL.textTertiary }}>
                          {formatTime(session.updatedAt)}
                        </Text>
                        <Text style={{ fontSize: 11, color: IMPERIAL.textSecondary }}>
                          {session.messages.length} رسالة
                        </Text>
                        <Text style={{ fontSize: 10, color: IMPERIAL.gold }}>
                          {session.provider}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
