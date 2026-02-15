import { BACKEND_URL } from '../api';
import { useState, useCallback } from 'react';

export interface SlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  created: number;
  is_archived: boolean;
  is_general: boolean;
  num_members: number;
}

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  profile: {
    display_name: string;
    email: string;
    image_72: string;
  };
  is_admin: boolean;
  is_owner: boolean;
}

export interface SlackMessage {
  ts: string;
  user: string;
  text: string;
  channel: string;
}

export function useSlack() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = useCallback(async (): Promise<SlackChannel[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/slack/channels`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Failed to fetch channels');
      const data = await response.json();
      return data.channels || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async (): Promise<SlackUser[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/slack/users`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      return data.users || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (
    channel: string,
    limit: number = 50
  ): Promise<SlackMessage[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/integrations/slack/channels/${channel}/messages?limit=${limit}`,
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      return data.messages || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (
    channel: string,
    text: string,
    threadTs?: string,
    blocks?: any[]
  ): Promise<{ ok: boolean; ts?: string } | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/slack/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ channel, text, thread_ts: threadTs, blocks }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      const data = await response.json();
      return data.message || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchChannels,
    fetchUsers,
    fetchMessages,
    sendMessage,
  };
}
