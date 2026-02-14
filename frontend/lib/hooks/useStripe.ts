import { BACKEND_URL } from '../api';
import { useState, useCallback } from 'react';

export interface StripeCustomer {
  id: string;
  object: string;
  email: string | null;
  name: string | null;
  created: number;
  currency: string | null;
  balance: number;
  delinquent: boolean;
}

export interface StripeProduct {
  id: string;
  object: string;
  name: string;
  description: string | null;
  active: boolean;
  created: number;
  default_price: string | null;
}

export interface StripeSubscription {
  id: string;
  object: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  customer: string;
  price_id: string;
  cancel_at_period_end: boolean;
}

export interface StripePaymentIntent {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
  metadata: Record<string, string>;
}

export function useStripe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async (): Promise<StripeCustomer[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/stripe/customers`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      return data.customers || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomer = useCallback(async (data: {
    email?: string;
    name?: string;
    phone?: string;
  }): Promise<StripeCustomer | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/stripe/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create customer');
      const result = await response.json();
      return result.customer || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async (): Promise<StripeProduct[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/stripe/products`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data.products || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: {
    name: string;
    description?: string;
    active?: boolean;
  }): Promise<StripeProduct | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/stripe/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create product');
      const result = await response.json();
      return result.product || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPaymentIntent = useCallback(async (data: {
    amount: number;
    currency?: string;
    customer?: string;
  }): Promise<StripePaymentIntent | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/stripe/payment-intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create payment intent');
      const result = await response.json();
      return result.paymentIntent || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubscriptions = useCallback(async (customerId?: string): Promise<StripeSubscription[]> => {
    setLoading(true);
    setError(null);
    try {
      const url = customerId 
        ? `${BACKEND_URL}/api/integrations/stripe/subscriptions?customer=${customerId}`
        : `${BACKEND_URL}/api/integrations/stripe/subscriptions`;
      const response = await fetch(url, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      const data = await response.json();
      return data.subscriptions || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubscription = useCallback(async (data: {
    customer: string;
    price_id: string;
  }): Promise<StripeSubscription | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/stripe/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create subscription');
      const result = await response.json();
      return result.subscription || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCheckoutSession = useCallback(async (data: {
    line_items?: Array<{ price_data: any; quantity: number }>;
    customer?: string;
    success_url?: string;
    cancel_url?: string;
  }): Promise<{ id: string; url: string } | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/stripe/checkout-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create checkout session');
      const result = await response.json();
      return result.session || null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBalance = useCallback(async (): Promise<{ available: any[]; pending: any[] } | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/integrations/stripe/balance`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      return data.balance || null;
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
    fetchCustomers,
    createCustomer,
    fetchProducts,
    createProduct,
    createPaymentIntent,
    fetchSubscriptions,
    createSubscription,
    createCheckoutSession,
    fetchBalance,
  };
}
