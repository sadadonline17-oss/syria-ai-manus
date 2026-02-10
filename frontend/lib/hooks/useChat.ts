import { BACKEND_URL } from '../api';
import { useChatStore } from '../stores/chat-store';
import { useSettingsStore } from '../stores/settings-store';
import { useCallback, useEffect } from 'react';

export function useChat() {
  const {
    messages,
    isStreaming,
    sessions,
    activeSessionId,
    addMessage,
    updateMessage,
    setStreaming,
    finishStreaming,
    clearMessages,
    createSession,
    switchSession,
    deleteSession,
    loadSessions,
  } = useChatStore();
  const { selectedProvider, selectedModel, apiKeys } = useSettingsStore();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      let sessionId = activeSessionId;
      if (!sessionId) {
        sessionId = createSession(selectedProvider, selectedModel);
      }

      addMessage({ role: 'user', content: text.trim() });

      const assistantId = addMessage({ role: 'assistant', content: '', isStreaming: true });
      setStreaming(true);

      try {
        const chatMessages = useChatStore
          .getState()
          .messages.filter((m) => m.id !== assistantId)
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        const response = await fetch(`${BACKEND_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({
            messages: chatMessages,
            model: selectedModel,
            provider: selectedProvider,
            apiKeys,
          }),
        });

        if (!response.ok) {
          const err = await response.text();
          updateMessage(assistantId, `خطأ: ${err}`);
          finishStreaming(assistantId);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          updateMessage(assistantId, 'خطأ: لا يمكن قراءة الاستجابة');
          finishStreaming(assistantId);
          return;
        }

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          updateMessage(assistantId, accumulated);
        }

        finishStreaming(assistantId);
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'خطأ غير معروف';
        updateMessage(assistantId, `خطأ: ${msg}`);
        finishStreaming(assistantId);
      }
    },
    [
      isStreaming,
      selectedProvider,
      selectedModel,
      apiKeys,
      activeSessionId,
      addMessage,
      updateMessage,
      setStreaming,
      finishStreaming,
      createSession,
    ]
  );

  return {
    messages,
    isStreaming,
    sessions,
    activeSessionId,
    sendMessage,
    clearMessages,
    createSession,
    switchSession,
    deleteSession,
  };
}
