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
export * from './netlify';
export * from './cloudflare';
export * from './firebase';
export * from './stitch';
export * from './free-providers';

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
export { createNetlifyIntegration, NetlifyIntegration } from './netlify';
export { createCloudflareIntegration, CloudflareIntegration } from './cloudflare';
export { createFirebaseIntegration, FirebaseIntegration } from './firebase';
export { createStitchGoogleIntegration, StitchGoogleIntegration } from './stitch';
export {
  createRailwayIntegration,
  createRenderIntegration,
  createFlyIntegration,
  createPlanetScaleIntegration,
  createNeonIntegration,
  createMongoDBIntegration,
} from './free-providers';

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
  const { createGitHubIntegration } = await import('./github');
  const github = createGitHubIntegration();
  if (github) {
    try {
      await github.listRepos();
      statuses.push({ name: 'GitHub', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'GitHub', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'GitHub', configured: false, connected: false });
  }

  // Check Slack
  const { createSlackIntegration } = await import('./slack');
  const slack = createSlackIntegration();
  if (slack) {
    try {
      await slack.testConnection();
      statuses.push({ name: 'Slack', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'Slack', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'Slack', configured: false, connected: false });
  }

  // Check Stripe
  const { createStripeIntegration } = await import('./stripe');
  const stripe = createStripeIntegration();
  if (stripe) {
    try {
      await stripe.getBalance();
      statuses.push({ name: 'Stripe', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'Stripe', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'Stripe', configured: false, connected: false });
  }

  // Check Twilio
  const { createTwilioIntegration } = await import('./twilio');
  const twilio = createTwilioIntegration();
  if (twilio) {
    try {
      await twilio.getAccount();
      statuses.push({ name: 'Twilio', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'Twilio', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'Twilio', configured: false, connected: false });
  }

  // Check Vercel
  const { createVercelIntegration } = await import('./vercel');
  const vercel = createVercelIntegration();
  if (vercel) {
    try {
      await vercel.getCurrentUser();
      statuses.push({ name: 'Vercel', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'Vercel', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'Vercel', configured: false, connected: false });
  }

  // Check Netlify
  const { createNetlifyIntegration } = await import('./netlify');
  const netlify = createNetlifyIntegration();
  if (netlify) {
    try {
      await netlify.listSites();
      statuses.push({ name: 'Netlify', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'Netlify', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'Netlify', configured: false, connected: false });
  }

  // Check Cloudflare
  const { createCloudflareIntegration } = await import('./cloudflare');
  const cloudflare = createCloudflareIntegration();
  if (cloudflare) {
    try {
      await cloudflare.getAccount();
      statuses.push({ name: 'Cloudflare', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'Cloudflare', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'Cloudflare', configured: false, connected: false });
  }

  // Check Firebase
  const { createFirebaseIntegration } = await import('./firebase');
  const firebase = createFirebaseIntegration();
  if (firebase) {
    try {
      await firebase.getProject();
      statuses.push({ name: 'Firebase', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'Firebase', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'Firebase', configured: false, connected: false });
  }

  // Check Telegram
  const { createTelegramIntegration } = await import('./telegram');
  const telegram = createTelegramIntegration();
  if (telegram) {
    try {
      await telegram.getMe();
      statuses.push({ name: 'Telegram', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'Telegram', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'Telegram', configured: false, connected: false });
  }

  // Check Discord
  const { createDiscordIntegration } = await import('./discord');
  const discord = createDiscordIntegration();
  if (discord) {
    try {
      await discord.testConnection();
      statuses.push({ name: 'Discord', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'Discord', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'Discord', configured: false, connected: false });
  }

  // Check Expo
  const { createExpoIntegration } = await import('./expo');
  const expo = createExpoIntegration();
  if (expo) {
    try {
      await expo.testConnection();
      statuses.push({ name: 'Expo', configured: true, connected: true });
    } catch (error) {
      statuses.push({ name: 'Expo', configured: true, connected: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    statuses.push({ name: 'Expo', configured: false, connected: false });
  }

  return statuses;
}
