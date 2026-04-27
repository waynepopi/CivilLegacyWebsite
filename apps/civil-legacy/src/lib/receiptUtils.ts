// ─── Receipt Data Types ─────────────────────────────────────────────────────

export interface ReceiptService {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface ReceiptData {
  receiptNo: string;
  dateIssued: string;
  paymentMethod: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  services: ReceiptService[];
  transaction: {
    id: string;
    gateway: string;
    currency: string;
    status: string;
  };
  verificationUrl?: string;
  qrCodeImage?: string | null;
}

export interface CheckoutInfo {
  full_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
}

export interface CartItemForReceipt {
  id: string;
  title: string;
  price: number;
  pillar?: string;
}

// ─── Formatting Helpers ─────────────────────────────────────────────────────

/**
 * Format a number as a USD currency string.
 * e.g. 200 → "$200.00"
 */
export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculate the total for a single line item.
 */
export function calculateLineTotal(qty: number, unitPrice: number): number {
  return qty * unitPrice;
}

/**
 * Calculate the grand total across all services.
 */
export function calculateGrandTotal(services: ReceiptService[]): number {
  return services.reduce(
    (sum, svc) => sum + calculateLineTotal(svc.qty, svc.unitPrice),
    0
  );
}

/**
 * Generate a unique receipt number in the format CLC-REC-XXXXXX.
 */
export function generateReceiptNo(): string {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `CLC-REC-${randomPart}`;
}

/**
 * Format a Date as DD/MM/YYYY.
 */
export function formatReceiptDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Build a full ReceiptData object from checkout + cart data.
 */
export function buildReceiptData(opts: {
  checkoutInfo: CheckoutInfo;
  cartItems: CartItemForReceipt[];
  transactionRef?: string;
  amount?: number;
  gateway?: string;
}): ReceiptData {
  const {
    checkoutInfo,
    cartItems,
    transactionRef,
    gateway = 'Paynow',
  } = opts;

  // Map cart items to receipt services (qty 1 each since each cart add is a single unit)
  const services: ReceiptService[] = cartItems.map((item) => ({
    description: item.title,
    qty: 1,
    unitPrice: item.price,
  }));

  return {
    receiptNo: generateReceiptNo(),
    dateIssued: formatReceiptDate(new Date()),
    paymentMethod: 'Online Payment (Website)',
    client: {
      name: checkoutInfo.full_name,
      email: checkoutInfo.email,
      phone: checkoutInfo.phone,
    },
    services,
    transaction: {
      id: transactionRef || `PW${Date.now()}`,
      gateway,
      currency: 'USD',
      status: 'PAID',
    },
    verificationUrl: undefined,
    qrCodeImage: null,
  };
}
