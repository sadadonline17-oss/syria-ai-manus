/**
 * Integration Routes for Syria AI
 * Real API endpoints for GitHub, Slack, Stripe, Twilio, and Vercel
 */

import { Hono } from 'hono';
import { 
  createGitHubIntegration,
  createSlackIntegration,
  createStripeIntegration,
  createTwilioIntegration,
  createVercelIntegration,
  checkIntegrations,
} from '../lib/integrations';

const integrations = new Hono();

// Get all integration statuses
integrations.get('/status', async (c) => {
  try {
    const statuses = await checkIntegrations();
    return c.json({ integrations: statuses });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

// ============ GitHub Routes ============

integrations.get('/github/repos', async (c) => {
  try {
    const github = createGitHubIntegration();
    if (!github) {
      return c.json({ error: 'GitHub not configured' }, 400);
    }
    const username = c.req.query('username');
    const repos = await github.listRepos(username || undefined);
    return c.json({ repos });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/github/repos/:owner/:repo', async (c) => {
  try {
    const github = createGitHubIntegration();
    if (!github) {
      return c.json({ error: 'GitHub not configured' }, 400);
    }
    const { owner, repo } = c.req.param();
    const repoData = await github.getRepo(owner, repo);
    return c.json({ repo: repoData });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/github/repos', async (c) => {
  try {
    const github = createGitHubIntegration();
    if (!github) {
      return c.json({ error: 'GitHub not configured' }, 400);
    }
    const body = await c.req.json();
    const { name, description, isPrivate } = body;
    const repo = await github.createRepo(name, description, isPrivate);
    return c.json({ repo });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/github/repos/:owner/:repo/issues', async (c) => {
  try {
    const github = createGitHubIntegration();
    if (!github) {
      return c.json({ error: 'GitHub not configured' }, 400);
    }
    const { owner, repo } = c.req.param();
    const state = c.req.query('state') || 'open';
    const issues = await github.listIssues(owner, repo, state);
    return c.json({ issues });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/github/repos/:owner/:repo/issues', async (c) => {
  try {
    const github = createGitHubIntegration();
    if (!github) {
      return c.json({ error: 'GitHub not configured' }, 400);
    }
    const { owner, repo } = c.req.param();
    const body = await c.req.json();
    const { title, body: issueBody, labels } = body;
    const issue = await github.createIssue(owner, repo, title, issueBody, labels);
    return c.json({ issue });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/github/repos/:owner/:repo/pulls', async (c) => {
  try {
    const github = createGitHubIntegration();
    if (!github) {
      return c.json({ error: 'GitHub not configured' }, 400);
    }
    const { owner, repo } = c.req.param();
    const state = c.req.query('state') || 'open';
    const pulls = await github.listPullRequests(owner, repo, state);
    return c.json({ pulls });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/github/repos/:owner/:repo/actions', async (c) => {
  try {
    const github = createGitHubIntegration();
    if (!github) {
      return c.json({ error: 'GitHub not configured' }, 400);
    }
    const { owner, repo } = c.req.param();
    const runs = await github.listWorkflowRuns(owner, repo);
    return c.json({ workflow_runs: runs.workflow_runs });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

// ============ Slack Routes ============

integrations.get('/slack/channels', async (c) => {
  try {
    const slack = createSlackIntegration();
    if (!slack) {
      return c.json({ error: 'Slack not configured' }, 400);
    }
    const result = await slack.listChannels();
    return c.json({ channels: result.channels });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/slack/message', async (c) => {
  try {
    const slack = createSlackIntegration();
    if (!slack) {
      return c.json({ error: 'Slack not configured' }, 400);
    }
    const body = await c.req.json();
    const { channel, text, thread_ts, blocks } = body;
    const result = await slack.postMessage(channel, text, { thread_ts, blocks });
    return c.json({ message: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/slack/channels/:channel/messages', async (c) => {
  try {
    const slack = createSlackIntegration();
    if (!slack) {
      return c.json({ error: 'Slack not configured' }, 400);
    }
    const channel = c.req.param('channel');
    const limit = parseInt(c.req.query('limit') || '50');
    const result = await slack.getConversationHistory(channel, { limit });
    return c.json({ messages: result.messages, has_more: result.has_more });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/slack/users', async (c) => {
  try {
    const slack = createSlackIntegration();
    if (!slack) {
      return c.json({ error: 'Slack not configured' }, 400);
    }
    const result = await slack.listUsers();
    return c.json({ users: result.members });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

// ============ Stripe Routes ============

integrations.get('/stripe/customers', async (c) => {
  try {
    const stripe = createStripeIntegration();
    if (!stripe) {
      return c.json({ error: 'Stripe not configured' }, 400);
    }
    const result = await stripe.listCustomers();
    return c.json({ customers: result.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/stripe/customers', async (c) => {
  try {
    const stripe = createStripeIntegration();
    if (!stripe) {
      return c.json({ error: 'Stripe not configured' }, 400);
    }
    const body = await c.req.json();
    const customer = await stripe.createCustomer(body);
    return c.json({ customer });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/stripe/payment-intents', async (c) => {
  try {
    const stripe = createStripeIntegration();
    if (!stripe) {
      return c.json({ error: 'Stripe not configured' }, 400);
    }
    const body = await c.req.json();
    const intent = await stripe.createPaymentIntent(body);
    return c.json({ paymentIntent: intent });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/stripe/products', async (c) => {
  try {
    const stripe = createStripeIntegration();
    if (!stripe) {
      return c.json({ error: 'Stripe not configured' }, 400);
    }
    const result = await stripe.listProducts();
    return c.json({ products: result.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/stripe/products', async (c) => {
  try {
    const stripe = createStripeIntegration();
    if (!stripe) {
      return c.json({ error: 'Stripe not configured' }, 400);
    }
    const body = await c.req.json();
    const product = await stripe.createProduct(body);
    return c.json({ product });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/stripe/subscriptions', async (c) => {
  try {
    const stripe = createStripeIntegration();
    if (!stripe) {
      return c.json({ error: 'Stripe not configured' }, 400);
    }
    const body = await c.req.json();
    const subscription = await stripe.createSubscription(body);
    return c.json({ subscription });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/stripe/subscriptions', async (c) => {
  try {
    const stripe = createStripeIntegration();
    if (!stripe) {
      return c.json({ error: 'Stripe not configured' }, 400);
    }
    const customerId = c.req.query('customer');
    const result = await stripe.listSubscriptions(customerId);
    return c.json({ subscriptions: result.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/stripe/checkout-sessions', async (c) => {
  try {
    const stripe = createStripeIntegration();
    if (!stripe) {
      return c.json({ error: 'Stripe not configured' }, 400);
    }
    const body = await c.req.json();
    const session = await stripe.createCheckoutSession(body);
    return c.json({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/stripe/balance', async (c) => {
  try {
    const stripe = createStripeIntegration();
    if (!stripe) {
      return c.json({ error: 'Stripe not configured' }, 400);
    }
    const balance = await stripe.getBalance();
    return c.json({ balance });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

// ============ Twilio Routes ============

integrations.post('/twilio/sms', async (c) => {
  try {
    const twilio = createTwilioIntegration();
    if (!twilio) {
      return c.json({ error: 'Twilio not configured' }, 400);
    }
    const body = await c.req.json();
    const { to, message, from } = body;
    const result = await twilio.sendSMS(to, message, { from });
    return c.json({ message: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/twilio/whatsapp', async (c) => {
  try {
    const twilio = createTwilioIntegration();
    if (!twilio) {
      return c.json({ error: 'Twilio not configured' }, 400);
    }
    const body = await c.req.json();
    const { to, message, from, mediaUrl } = body;
    const result = await twilio.sendWhatsApp(to, message, { from, mediaUrl });
    return c.json({ message: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/twilio/calls', async (c) => {
  try {
    const twilio = createTwilioIntegration();
    if (!twilio) {
      return c.json({ error: 'Twilio not configured' }, 400);
    }
    const body = await c.req.json();
    const { to, url, from, method, statusCallback } = body;
    const result = await twilio.makeCall(to, url, { from, method, statusCallback });
    return c.json({ call: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/twilio/messages', async (c) => {
  try {
    const twilio = createTwilioIntegration();
    if (!twilio) {
      return c.json({ error: 'Twilio not configured' }, 400);
    }
    const to = c.req.query('to');
    const from = c.req.query('from');
    const result = await twilio.listMessages({ to, from });
    return c.json({ messages: result.messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/twilio/phone-numbers', async (c) => {
  try {
    const twilio = createTwilioIntegration();
    if (!twilio) {
      return c.json({ error: 'Twilio not configured' }, 400);
    }
    const result = await twilio.listPhoneNumbers();
    return c.json({ phoneNumbers: result.incomingPhoneNumbers });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/twilio/account', async (c) => {
  try {
    const twilio = createTwilioIntegration();
    if (!twilio) {
      return c.json({ error: 'Twilio not configured' }, 400);
    }
    const account = await twilio.getAccount();
    return c.json({ account });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

// ============ Vercel Routes ============

integrations.get('/vercel/projects', async (c) => {
  try {
    const vercel = createVercelIntegration();
    if (!vercel) {
      return c.json({ error: 'Vercel not configured' }, 400);
    }
    const result = await vercel.listProjects();
    return c.json({ projects: result.projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/vercel/projects', async (c) => {
  try {
    const vercel = createVercelIntegration();
    if (!vercel) {
      return c.json({ error: 'Vercel not configured' }, 400);
    }
    const body = await c.req.json();
    const result = await vercel.createProject(body);
    return c.json({ project: result.project });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/vercel/deployments', async (c) => {
  try {
    const vercel = createVercelIntegration();
    if (!vercel) {
      return c.json({ error: 'Vercel not configured' }, 400);
    }
    const projectId = c.req.query('projectId');
    const result = await vercel.listDeployments(projectId);
    return c.json({ deployments: result.deployments });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/vercel/deployments', async (c) => {
  try {
    const vercel = createVercelIntegration();
    if (!vercel) {
      return c.json({ error: 'Vercel not configured' }, 400);
    }
    const body = await c.req.json();
    const result = await vercel.createDeployment(body);
    return c.json({ deployment: result.deployment });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/vercel/domains', async (c) => {
  try {
    const vercel = createVercelIntegration();
    if (!vercel) {
      return c.json({ error: 'Vercel not configured' }, 400);
    }
    const result = await vercel.listDomains();
    return c.json({ domains: result.domains });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/vercel/domains', async (c) => {
  try {
    const vercel = createVercelIntegration();
    if (!vercel) {
      return c.json({ error: 'Vercel not configured' }, 400);
    }
    const body = await c.req.json();
    const { name, projectId } = body;
    const result = await vercel.addDomain(name, projectId);
    return c.json({ domain: result.domain });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.get('/vercel/projects/:projectId/env', async (c) => {
  try {
    const vercel = createVercelIntegration();
    if (!vercel) {
      return c.json({ error: 'Vercel not configured' }, 400);
    }
    const { projectId } = c.req.param();
    const result = await vercel.listEnvVariables(projectId);
    return c.json({ envs: result.envs });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

integrations.post('/vercel/projects/:projectId/env', async (c) => {
  try {
    const vercel = createVercelIntegration();
    if (!vercel) {
      return c.json({ error: 'Vercel not configured' }, 400);
    }
    const { projectId } = c.req.param();
    const body = await c.req.json();
    const result = await vercel.createEnvVariable(projectId, body);
    return c.json({ env: result.created });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default integrations;