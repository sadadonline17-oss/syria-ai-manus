/**
 * Real Stripe API Integration
 * Provides actual functionality for payments, subscriptions, and invoices
 */

import Stripe from 'stripe';

export interface StripeCustomer {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  created: number;
  currency: string | null;
  default_source: string | null;
  delinquent: boolean;
  livemode: boolean;
  metadata: Record<string, string>;
}

export interface StripePaymentIntent {
  id: string;
  amount: number;
  amount_received: number;
  currency: string;
  status: string;
  client_secret: string;
  description: string | null;
  created: number;
  customer: string | null;
  metadata: Record<string, string>;
}

export interface StripeSubscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  customer: string;
  plan: {
    id: string;
    amount: number;
    currency: string;
    interval: string;
    interval_count: number;
    product: string;
  };
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        unit_amount: number;
        currency: string;
        product: string;
      };
    }>;
  };
  metadata: Record<string, string>;
}

export interface StripeInvoice {
  id: string;
  number: string | null;
  status: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  customer: string;
  subscription: string | null;
  created: number;
  due_date: number | null;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
  lines: {
    data: Array<{
      id: string;
      description: string;
      amount: number;
      currency: string;
      quantity: number;
    }>;
  };
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  images: string[];
  metadata: Record<string, string>;
  default_price: string | null;
}

export interface StripePrice {
  id: string;
  unit_amount: number | null;
  currency: string;
  recurring: {
    interval: string;
    interval_count: number;
  } | null;
  product: string;
  active: boolean;
  metadata: Record<string, string>;
}

export interface StripeCheckoutSession {
  id: string;
  url: string | null;
  status: string;
  payment_status: string;
  customer_email: string | null;
  customer: string | null;
  subscription: string | null;
  amount_total: number;
  currency: string;
  success_url: string;
  cancel_url: string;
  line_items: {
    data: Array<{
      id: string;
      description: string;
      amount_total: number;
      currency: string;
      quantity: number;
    }>;
  } | null;
}

export class StripeIntegration {
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  // Customer Operations
  async createCustomer(params: {
    email?: string;
    name?: string;
    phone?: string;
    metadata?: Record<string, string>;
  }): Promise<StripeCustomer> {
    const customer = await this.stripe.customers.create(params);
    return customer as StripeCustomer;
  }

  async getCustomer(customerId: string): Promise<StripeCustomer> {
    const customer = await this.stripe.customers.retrieve(customerId);
    return customer as StripeCustomer;
  }

  async updateCustomer(
    customerId: string,
    params: {
      email?: string;
      name?: string;
      phone?: string;
      metadata?: Record<string, string>;
    }
  ): Promise<StripeCustomer> {
    const customer = await this.stripe.customers.update(customerId, params);
    return customer as StripeCustomer;
  }

  async listCustomers(limit: number = 100): Promise<{ data: StripeCustomer[] }> {
    const customers = await this.stripe.customers.list({ limit });
    return customers as { data: StripeCustomer[] };
  }

  async deleteCustomer(customerId: string): Promise<{ id: string; deleted: boolean }> {
    return await this.stripe.customers.del(customerId) as { id: string; deleted: boolean };
  }

  // Payment Intent Operations
  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    customer?: string;
    description?: string;
    metadata?: Record<string, string>;
    automatic_payment_methods?: { enabled: boolean };
  }): Promise<StripePaymentIntent> {
    const intent = await this.stripe.paymentIntents.create({
      ...params,
      automatic_payment_methods: params.automatic_payment_methods ?? { enabled: true },
    });
    return intent as StripePaymentIntent;
  }

  async getPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return intent as StripePaymentIntent;
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethod: string
  ): Promise<StripePaymentIntent> {
    const intent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod,
    });
    return intent as StripePaymentIntent;
  }

  async capturePaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    const intent = await this.stripe.paymentIntents.capture(paymentIntentId);
    return intent as StripePaymentIntent;
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    const intent = await this.stripe.paymentIntents.cancel(paymentIntentId);
    return intent as StripePaymentIntent;
  }

  // Product Operations
  async createProduct(params: {
    name: string;
    description?: string;
    images?: string[];
    metadata?: Record<string, string>;
  }): Promise<StripeProduct> {
    const product = await this.stripe.products.create(params);
    return product as StripeProduct;
  }

  async getProduct(productId: string): Promise<StripeProduct> {
    const product = await this.stripe.products.retrieve(productId);
    return product as StripeProduct;
  }

  async listProducts(limit: number = 100): Promise<{ data: StripeProduct[] }> {
    const products = await this.stripe.products.list({ limit, active: true });
    return products as { data: StripeProduct[] };
  }

  async updateProduct(
    productId: string,
    params: {
      name?: string;
      description?: string;
      active?: boolean;
      metadata?: Record<string, string>;
    }
  ): Promise<StripeProduct> {
    const product = await this.stripe.products.update(productId, params);
    return product as StripeProduct;
  }

  async deleteProduct(productId: string): Promise<{ id: string; deleted: boolean }> {
    return await this.stripe.products.del(productId) as { id: string; deleted: boolean };
  }

  // Price Operations
  async createPrice(params: {
    unit_amount: number;
    currency: string;
    product: string;
    recurring?: {
      interval: 'day' | 'week' | 'month' | 'year';
      interval_count?: number;
    };
    metadata?: Record<string, string>;
  }): Promise<StripePrice> {
    const price = await this.stripe.prices.create(params);
    return price as StripePrice;
  }

  async getPrice(priceId: string): Promise<StripePrice> {
    const price = await this.stripe.prices.retrieve(priceId);
    return price as StripePrice;
  }

  async listPrices(productId?: string): Promise<{ data: StripePrice[] }> {
    const prices = await this.stripe.prices.list({
      product: productId,
      active: true,
    });
    return prices as { data: StripePrice[] };
  }

  // Subscription Operations
  async createSubscription(params: {
    customer: string;
    items: Array<{ price: string; quantity?: number }>;
    trial_period_days?: number;
    metadata?: Record<string, string>;
  }): Promise<StripeSubscription> {
    const subscription = await this.stripe.subscriptions.create(params);
    return subscription as StripeSubscription;
  }

  async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    return subscription as StripeSubscription;
  }

  async updateSubscription(
    subscriptionId: string,
    params: {
      items?: Array<{ id?: string; price: string; quantity?: number }>;
      metadata?: Record<string, string>;
      cancel_at_period_end?: boolean;
    }
  ): Promise<StripeSubscription> {
    const subscription = await this.stripe.subscriptions.update(subscriptionId, params);
    return subscription as StripeSubscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<StripeSubscription> {
    const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
    return subscription as StripeSubscription;
  }

  async listSubscriptions(customerId?: string): Promise<{ data: StripeSubscription[] }> {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
    });
    return subscriptions as { data: StripeSubscription[] };
  }

  // Invoice Operations
  async getInvoice(invoiceId: string): Promise<StripeInvoice> {
    const invoice = await this.stripe.invoices.retrieve(invoiceId);
    return invoice as StripeInvoice;
  }

  async listInvoices(customerId?: string, limit: number = 10): Promise<{ data: StripeInvoice[] }> {
    const invoices = await this.stripe.invoices.list({
      customer: customerId,
      limit,
    });
    return invoices as { data: StripeInvoice[] };
  }

  async createInvoice(customerId: string, params?: {
    description?: string;
    metadata?: Record<string, string>;
  }): Promise<StripeInvoice> {
    const invoice = await this.stripe.invoices.create({
      customer: customerId,
      ...params,
    });
    return invoice as StripeInvoice;
  }

  async finalizeInvoice(invoiceId: string): Promise<StripeInvoice> {
    const invoice = await this.stripe.invoices.finalizeInvoice(invoiceId);
    return invoice as StripeInvoice;
  }

  async payInvoice(invoiceId: string): Promise<StripeInvoice> {
    const invoice = await this.stripe.invoices.pay(invoiceId);
    return invoice as StripeInvoice;
  }

  // Checkout Session Operations
  async createCheckoutSession(params: {
    success_url: string;
    cancel_url: string;
    mode: 'payment' | 'subscription' | 'setup';
    line_items: Array<{
      price: string;
      quantity: number;
    }>;
    customer?: string;
    customer_email?: string;
    metadata?: Record<string, string>;
  }): Promise<StripeCheckoutSession> {
    const session = await this.stripe.checkout.sessions.create(params);
    return session as StripeCheckoutSession;
  }

  async getCheckoutSession(sessionId: string): Promise<StripeCheckoutSession> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
    return session as StripeCheckoutSession;
  }

  // Webhook Operations
  constructWebhookEvent(payload: string | Buffer, signature: string, secret: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }

  // Balance Operations
  async getBalance(): Promise<{
    available: Array<{ amount: number; currency: string }>;
    pending: Array<{ amount: number; currency: string }>;
  }> {
    const balance = await this.stripe.balance.retrieve();
    return balance;
  }

  // Refund Operations
  async createRefund(params: {
    payment_intent: string;
    amount?: number;
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  }): Promise<{ id: string; status: string; amount: number }> {
    const refund = await this.stripe.refunds.create(params);
    return refund as { id: string; status: string; amount: number };
  }
}

// Factory function for creating Stripe integration instance
export function createStripeIntegration(secretKey?: string): StripeIntegration | null {
  const stripeKey = secretKey || process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.warn('Stripe secret key not configured. Set STRIPE_SECRET_KEY environment variable.');
    return null;
  }
  return new StripeIntegration(stripeKey);
}