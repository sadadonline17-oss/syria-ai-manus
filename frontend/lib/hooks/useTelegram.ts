import { useState, useCallback } from 'react';
import { api } from '../api';

interface TelegramChat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface TelegramMessage {
  message_id: number;
  from?: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  chat: {
    id: number;
    type: string;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  date: number;
  text?: string;
  entities?: any[];
  photo?: any[];
  document?: any[];
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  callback_query?: {
    id: string;
    from: any;
    message?: TelegramMessage;
    data?: string;
  };
}

interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
}

export function useTelegram() {
  const [chats, setChats] = useState<TelegramChat[]>([]);
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [updates, setUpdates] = useState<TelegramUpdate[]>([]);
  const [botInfo, setBotInfo] = useState<TelegramBotInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/integrations/telegram/me');
      setBotInfo(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get bot info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUpdates = useCallback(async (offset: number = 0, limit: number = 100) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/telegram/updates?offset=${offset}&limit=${limit}`);
      setUpdates(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to get updates');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (chatId: number, text: string, parseMode?: string, replyMarkup?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/telegram/send', {
        chat_id: chatId,
        text,
        parse_mode: parseMode,
        reply_markup: replyMarkup,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendPhoto = useCallback(async (chatId: number, photo: string, caption?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/telegram/photo', {
        chat_id: chatId,
        photo,
        caption,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to send photo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendDocument = useCallback(async (chatId: number, document: string, caption?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/telegram/document', {
        chat_id: chatId,
        document,
        caption,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to send document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendPoll = useCallback(async (chatId: number, question: string, options: string[], isAnonymous: boolean = true, allowsMultipleAnswers: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/telegram/poll', {
        chat_id: chatId,
        question,
        options,
        is_anonymous: isAnonymous,
        allows_multiple_answers: allowsMultipleAnswers,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to send poll');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const answerCallbackQuery = useCallback(async (callbackQueryId: string, text?: string, showAlert?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/telegram/callback', {
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to answer callback query');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editMessageText = useCallback(async (chatId: number, messageId: number, text: string, parseMode?: string, replyMarkup?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch('/api/integrations/telegram/edit', {
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: parseMode,
        reply_markup: replyMarkup,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to edit message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMessage = useCallback(async (chatId: number, messageId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/integrations/telegram/message/${chatId}/${messageId}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getChat = useCallback(async (chatId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/telegram/chat/${chatId}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getChatAdministrators = useCallback(async (chatId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/telegram/admins/${chatId}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to get chat administrators');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const setWebhook = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/telegram/webhook', { url });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to set webhook');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteWebhook = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete('/api/integrations/telegram/webhook');
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to delete webhook');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    chats,
    messages,
    updates,
    botInfo,
    loading,
    error,
    getMe,
    getUpdates,
    sendMessage,
    sendPhoto,
    sendDocument,
    sendPoll,
    answerCallbackQuery,
    editMessageText,
    deleteMessage,
    getChat,
    getChatAdministrators,
    setWebhook,
    deleteWebhook,
  };
}
