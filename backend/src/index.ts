import { Hono } from 'hono';
import { cors } from 'hono/cors';
import chat from './routes/chat';
import models from './routes/models';
import providers from './routes/providers';

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

export default {
  fetch: app.fetch,
  port: 3002,
};
