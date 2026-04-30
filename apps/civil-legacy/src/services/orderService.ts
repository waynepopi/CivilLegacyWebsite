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
 * Creates an order, order_items, and a pending payment record.
 * @returns { orderId: string, paymentId: string }
 */
export async function createOrderFromCart(customer: CustomerInfo, cartItems: CartItem[], totalAmount?: number) {
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: {
      customer,
      cartItems,
      totalAmount
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to create checkout");
  }

  // data will contain { orderId, paymentId, orderNumber, browserUrl, pollUrl }
  return data;
}

/**
 * Calls the Supabase Edge Function for mock Paynow results.
 */
export async function callMockPaynowResult({
  orderId,
  paymentId,
  status,
}: {
  orderId: string;
  paymentId: string;
  status: "PAID" | "FAILED";
}) {
  const { data, error } = await supabase.functions.invoke("mock-paynow-result", {
    body: {
      orderId,
      paymentId,
      status,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to call mock Paynow result function");
  }

  return data;
}

/**
 * Updates payment and order status to PAID, and creates a receipt via Edge Function.
 */
export async function markMockPaymentPaid(orderId: string, paymentId: string) {
  return callMockPaynowResult({
    orderId,
    paymentId,
    status: "PAID",
  });
}

/**
 * Updates payment and order status to FAILED via Edge Function.
 */
export async function markMockPaymentFailed(orderId: string, paymentId: string) {
  return callMockPaynowResult({
    orderId,
    paymentId,
    status: "FAILED",
  });
}

/**
 * Fetches all receipt, order, and payment details and formats them into ReceiptData.
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
    dateIssued: new Date(receipt.created_at).toLocaleDateString('en-GB'), // DD/MM/YYYY
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
    throw new Error(error?.message || "Invalid verification code");
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
  };
}
/**
 * Fetches the status of an order and its latest payment.
 * Used for the Payment Status page.
 */
export async function getPaymentStatusByOrderId(orderId: string) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*),
      payments(*)
    `)
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || "Order not found");
  }

  // Sort payments by created_at to get the latest one
  const sortedPayments = (order.payments || []).sort(
    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const latestPayment = sortedPayments[0] || null;
  
  let receipt = null;
  if (latestPayment && latestPayment.status === 'PAID') {
    const { data: receiptData } = await supabase
      .from('public_receipt_verification')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle();
      
    if (receiptData) {
      receipt = receiptData;
    }
  }

  return {
    order,
    latestPayment,
    receipt
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
