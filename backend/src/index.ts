import { Hono } from 'hono';
import { cors } from 'hono/cors';
import chat from './routes/chat';
import models from './routes/models';
import providers from './routes/providers';
import integrations from './routes/integrations';
import terminal from './routes/terminal';
import agent from './routes/agent';
import agents from './routes/agents';

const app = new Hono();

app.use(
  '*',
  cors({
    credentials: true,
    origin: (origin) => origin || '*',
  }),
);

app.get('/', (c) => {
  return c.json({ status: 'ok', name: 'Syria AI Backend', version: '1.0.0' });
});

app.get('/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.route('/api/chat', chat);
app.route('/api/models', models);
app.route('/api/providers', providers);
app.route('/api/integrations', integrations);
app.route('/api/terminal', terminal);
app.route('/api/agent', agent);
app.route('/api/agents', agents);

export default {
  fetch: app.fetch,
  port: 3002,
};
