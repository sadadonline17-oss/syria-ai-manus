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
        let accumulatedText = '';
        let toolCallLogs = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          
          // Parse AI SDK Data Stream Protocol
          // Format: type:content (e.g., 0:"text", 9:{"toolCall":...})
          const lines = chunk.split('\n').filter(l => l.trim());
          
          for (const line of lines) {
            const type = line[0];
            const content = line.slice(2); // Skip type and colon
            
            try {
              if (type === '0') { // Text part
                const textPart = JSON.parse(content);
                accumulatedText += textPart;
              } else if (type === '9') { // Tool call
                const toolCall = JSON.parse(content);
                toolCallLogs += `\n> 🛠️ جاري استخدام أداة: **${toolCall.toolName}**...\n`;
              } else if (type === 'a') { // Tool result
                const toolResult = JSON.parse(content);
                toolCallLogs += `\n✅ اكتمل استخدام الأداة بنجاح.\n`;
              }
            } catch (e) {
              // Fallback for non-JSON or malformed parts
              if (!line.startsWith('{') && !line.startsWith('[')) {
                 // ignore
              }
            }
          }
          
          // Update UI with both logs and text
          updateMessage(assistantId, toolCallLogs + accumulatedText);
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
