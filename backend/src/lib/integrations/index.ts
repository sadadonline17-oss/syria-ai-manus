/**
 * Real API Integrations Index
 * Export all integration modules for Syria AI
 */

export * from './github';
export * from './slack';
export * from './stripe';
export * from './twilio';
export * from './vercel';

// Re-export factory functions
export { createGitHubIntegration, GitHubIntegration } from './github';
export { createSlackIntegration, SlackIntegration } from './slack';
export { createStripeIntegration, StripeIntegration } from './stripe';
export { createTwilioIntegration, TwilioIntegration } from './twilio';
export { createVercelIntegration, VercelIntegration } from './vercel';

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

  return statuses;
}