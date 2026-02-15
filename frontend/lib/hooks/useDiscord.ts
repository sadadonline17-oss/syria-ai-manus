import { useState, useCallback } from 'react';
import { api } from '../api';

interface DiscordGuild {
  id: string;
  name: string;
  icon: string;
  owner_id: string;
  permissions: number;
}

interface DiscordChannel {
  id: string;
  guild_id: string;
  name: string;
  type: number;
  parent_id: string;
  position: number;
}

interface DiscordMessage {
  id: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  attachments: any[];
  embeds: any[];
}

interface DiscordMember {
  user: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
  };
  nick: string | null;
  roles: string[];
  joined_at: string;
}

export function useDiscord() {
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [members, setMembers] = useState<DiscordMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuilds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/integrations/discord/guilds');
      setGuilds(response.data.guilds || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Discord guilds');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChannels = useCallback(async (guildId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/discord/channels/${guildId}`);
      setChannels(response.data.channels || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Discord channels');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (channelId: string, limit: number = 50) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/discord/messages/${channelId}?limit=${limit}`);
      setMessages(response.data.messages || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Discord messages');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (channelId: string, content: string, embeds?: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/discord/messages', {
        channelId,
        content,
        embeds,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to send Discord message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMembers = useCallback(async (guildId: string, limit: number = 100) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/integrations/discord/members/${guildId}?limit=${limit}`);
      setMembers(response.data.members || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Discord members');
    } finally {
      setLoading(false);
    }
  }, []);

  const addRole = useCallback(async (guildId: string, userId: string, roleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/discord/roles', {
        guildId,
        userId,
        roleId,
        action: 'add',
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to add role');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeRole = useCallback(async (guildId: string, userId: string, roleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/discord/roles', {
        guildId,
        userId,
        roleId,
        action: 'remove',
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to remove role');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createChannel = useCallback(async (guildId: string, name: string, type: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/integrations/discord/channels', {
        guildId,
        name,
        type,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create channel');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    guilds,
    channels,
    messages,
    members,
    loading,
    error,
    fetchGuilds,
    fetchChannels,
    fetchMessages,
    sendMessage,
    fetchMembers,
    addRole,
    removeRole,
    createChannel,
  };
}
