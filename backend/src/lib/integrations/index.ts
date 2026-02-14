/**
 * Real API Integrations Index
 * Export all integration modules for Syria AI
 */

export * from './github';
export * from './slack';
export * from './stripe';
export * from './twilio';
export * from './vercel';
export * from './telegram';
export * from './whatsapp';
export * from './messenger';
export * from './line';
export * from './discord';
export * from './expo';

// Re-export factory functions
export { createGitHubIntegration, GitHubIntegration } from './github';
export { createSlackIntegration, SlackIntegration } from './slack';
export { createStripeIntegration, StripeIntegration } from './stripe';
export { createTwilioIntegration, TwilioIntegration } from './twilio';
export { createVercelIntegration, VercelIntegration } from './vercel';
export { createTelegramIntegration, TelegramIntegration } from './telegram';
export { createWhatsAppIntegration, WhatsAppIntegration } from './whatsapp';
export { createMessengerIntegration, MessengerIntegration } from './messenger';
export { createLINEIntegration, LINEIntegration } from './line';
export { createDiscordIntegration, DiscordIntegration } from './discord';
export { createExpoIntegration, ExpoIntegration } from './expo';

// Integration status checker
export interface IntegrationStatus {
  name: string;
  configured: boolean;
  connected: boolean;
  error?: string;
}

export async function checkIntegrations(): Promise<IntegrationStatus[]> {
  const statuses: IntegrationStatus[] = [];

  // Check GitHub
  const github = createGitHubIntegration();
  if (github) {
    try {
      await github.listRepos();
      statuses.push({ name: 'GitHub', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'GitHub', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'GitHub', configured: false, connected: false });
  }

  // Check Slack
  const slack = createSlackIntegration();
  if (slack) {
    try {
      await slack.testConnection();
      statuses.push({ name: 'Slack', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'Slack', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'Slack', configured: false, connected: false });
  }

  // Check Stripe
  const stripe = createStripeIntegration();
  if (stripe) {
    try {
      await stripe.getBalance();
      statuses.push({ name: 'Stripe', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'Stripe', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'Stripe', configured: false, connected: false });
  }

  // Check Twilio
  const twilio = createTwilioIntegration();
  if (twilio) {
    try {
      await twilio.getAccount();
      statuses.push({ name: 'Twilio', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'Twilio', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'Twilio', configured: false, connected: false });
  }

  // Check Vercel
  const vercel = createVercelIntegration();
  if (vercel) {
    try {
      await vercel.getCurrentUser();
      statuses.push({ name: 'Vercel', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'Vercel', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'Vercel', configured: false, connected: false });
  }

  // Check Telegram
  const telegram = createTelegramIntegration();
  if (telegram) {
    try {
      await telegram.getMe();
      statuses.push({ name: 'Telegram', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'Telegram', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'Telegram', configured: false, connected: false });
  }

  // Check WhatsApp
  const whatsapp = createWhatsAppIntegration();
  if (whatsapp) {
    try {
      await whatsapp.testConnection();
      statuses.push({ name: 'WhatsApp', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'WhatsApp', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'WhatsApp', configured: false, connected: false });
  }

  // Check Messenger
  const messenger = createMessengerIntegration();
  if (messenger) {
    try {
      await messenger.testConnection();
      statuses.push({ name: 'Messenger', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'Messenger', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'Messenger', configured: false, connected: false });
  }

  // Check LINE
  const line = createLINEIntegration();
  if (line) {
    try {
      await line.testConnection();
      statuses.push({ name: 'LINE', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'LINE', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'LINE', configured: false, connected: false });
  }

  // Check Discord
  const discord = createDiscordIntegration();
  if (discord) {
    try {
      await discord.testConnection();
      statuses.push({ name: 'Discord', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'Discord', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'Discord', configured: false, connected: false });
  }

  // Check Expo
  const expo = createExpoIntegration();
  if (expo) {
    try {
      await expo.testConnection();
      statuses.push({ name: 'Expo', configured: true, connected: true });
    } catch (error) {
      statuses.push({ 
        name: 'Expo', 
        configured: true, 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    statuses.push({ name: 'Expo', configured: false, connected: false });
  }

  return statuses;
}