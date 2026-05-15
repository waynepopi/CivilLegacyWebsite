import { supabase } from '@/lib/supabaseClient';
import { generateReceiptNo, ReceiptData } from '@/lib/receiptUtils';

export interface CustomerInfo {
  full_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
}

export interface CartItem {
  id?: string;
  title: string;
  price: number;
  qty?: number;
}

// ---------------------------------------------------------------------------
// Session storage helpers
// The simulationToken is stored locally after checkout and passed to the
// mock gateway so that nobody else can mutate that payment's status.
// For real Paynow, this will be null and the gateway call is skipped.
// ---------------------------------------------------------------------------

const SIM_TOKEN_PREFIX = 'clc_sim_token_';

export function storeSimulationToken(paymentId: string, token: string | null) {
  if (!token) return;
  sessionStorage.setItem(`${SIM_TOKEN_PREFIX}${paymentId}`, token);
}

export function getSimulationToken(paymentId: string): string | null {
  return sessionStorage.getItem(`${SIM_TOKEN_PREFIX}${paymentId}`);
}

export function clearSimulationToken(paymentId: string) {
  sessionStorage.removeItem(`${SIM_TOKEN_PREFIX}${paymentId}`);
}

/**
 * Calculates the total of the cart.
 */
export function calculateCartTotal(cartItems: CartItem[]): number {
  return cartItems.reduce((acc, item) => acc + Number(item.price), 0);
}

/**
 * Formats a money amount as USD.
 */
export function formatMoney(amount: number): string {
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Creates an order, order_items, and a pending payment record via
 * the create-checkout Edge Function.
 *
 * Returns { orderId, paymentId, orderNumber, browserUrl, pollUrl, simulationToken }
 * The simulationToken is stored in sessionStorage automatically.
 */
export async function createOrderFromCart(customer: CustomerInfo, cartItems: CartItem[], totalAmount?: number) {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { customer, cartItems, totalAmount },
  });

  if (error) {
    throw new Error(error.message || 'Failed to create checkout');
  }

  // Store the simulation token for this payment session
  if (data?.paymentId && data?.simulationToken) {
    storeSimulationToken(data.paymentId, data.simulationToken);
  }

  return data as {
    orderId: string;
    paymentId: string;
    orderNumber: string;
    browserUrl: string;
    pollUrl: string;
    simulationToken: string | null;
  };
}

/**
 * Calls the mock-paynow-result Edge Function with the simulation token.
 * The token is read from sessionStorage automatically.
 *
 * If there is no token (e.g., order created before this change), the call
 * will be rejected by the server with a 403.
 */
export async function callMockPaynowResult({
  orderId,
  paymentId,
  status,
}: {
  orderId: string;
  paymentId: string;
  status: 'PAID' | 'FAILED' | 'EXPIRED';
}) {
  const simulationToken = getSimulationToken(paymentId);

  const { data, error } = await supabase.functions.invoke('mock-paynow-result', {
    body: { orderId, paymentId, status, simulationToken },
  });

  if (error) {
    throw new Error(error.message || 'Failed to call mock Paynow result function');
  }

  // Clear token after a terminal state is reached
  if (status === 'PAID' || status === 'FAILED' || status === 'EXPIRED') {
    clearSimulationToken(paymentId);
  }

  return data;
}

/**
 * Simulates a successful payment (PAID).
 */
export async function markMockPaymentPaid(orderId: string, paymentId: string) {
  return callMockPaynowResult({ orderId, paymentId, status: 'PAID' });
}

/**
 * Simulates a failed payment (FAILED).
 */
export async function markMockPaymentFailed(orderId: string, paymentId: string) {
  return callMockPaynowResult({ orderId, paymentId, status: 'FAILED' });
}

/**
 * Fetches payment and order status via the get-payment-status Edge Function.
 * This replaces direct DB queries to orders/payments and avoids PII exposure.
 *
 * Returns { order, payment, receipt }
 */
export async function getPaymentStatusByOrderId(orderId: string) {
  const { data, error } = await supabase.functions.invoke('get-payment-status', {
    body: { orderId },
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch payment status');
  }

  // Normalise to the shape the PaymentStatus page already expects
  const order = {
    ...data.order,
    // Map snake_case → what the page uses
    order_number: data.order?.orderNumber,
    total_amount: data.order?.totalAmount,
    created_at: data.order?.createdAt,
    order_items: data.order?.items ?? [],
    payments: data.payment ? [data.payment] : [],
  };

  return {
    order,
    latestPayment: data.payment ?? null,
    receipt: data.receipt ?? null,
  };
}

/**
 * Fetches all receipt, order, and payment details and formats them into ReceiptData.
 * Called from the /receipt/:receiptId page.
 */
export async function getReceiptData(receiptId: string): Promise<ReceiptData> {
  const { data: receipt, error } = await supabase
    .from('receipts')
    .select(`
      *,
      order:orders(
        *,
        order_items(*)
      ),
      payment:payments(*)
    `)
    .eq('id', receiptId)
    .single();

  if (error || !receipt) throw new Error(`Failed to load receipt: ${error?.message || 'Not found'}`);

  const order = Array.isArray(receipt.order) ? receipt.order[0] : receipt.order;
  const payment = Array.isArray(receipt.payment) ? receipt.payment[0] : receipt.payment;

  if (!order || !payment) throw new Error('Incomplete receipt data');

  const items = order.order_items || [];

  return {
    receiptNo: receipt.receipt_number,
    dateIssued: new Date(receipt.created_at).toLocaleDateString('en-GB'),
    paymentMethod: receipt.is_test ? 'Online Payment (Test)' : 'Online Payment (Paynow)',
    client: {
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone || '',
    },
    services: items.map((item: any) => ({
      description: item.description,
      qty: item.qty,
      unitPrice: Number(item.unit_price),
    })),
    transaction: {
      id: payment.id,
      gateway: payment.gateway,
      currency: 'USD',
      status: payment.status,
    },
    verification_code: receipt.verification_code,
    verification_status: receipt.verification_status,
    job_status: receipt.job_status,
  };
}

/**
 * Fetches a receipt by its unique verification code using the safe public view.
 */
export async function getReceiptByVerificationCode(code: string) {
  const { data, error } = await supabase
    .from('public_receipt_verification')
    .select('*')
    .eq('verification_code', code)
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Invalid verification code');
  }

  return {
    receipt_number: data.receipt_number,
    created_at: data.created_at,
    verification_status: data.verification_status,
    job_status: data.job_status,
    order_id: data.order_id,
    amount: data.amount,
    payment_status: data.payment_status,
    payment_gateway: data.payment_gateway,
    items: data.items,
  };
}

/**
 * Fetches all service categories from the database.
 */
export async function getServiceCategories() {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to load service categories: ${error.message}`);
  }

  return data;
}

/**
 * Fetches all services from the database.
 */
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to load services: ${error.message}`);
  }

  return data;
}
