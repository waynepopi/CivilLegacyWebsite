import { Router, Request, Response } from "express";

const router = Router();

// Mock toggle from environment variable
const MOCK_PAYNOW = process.env.MOCK_PAYNOW === 'true';

router.post("/initiate", (req: Request, res: Response) => {
  const { full_name, email, phone, whatsapp_number, items, total } = req.body;

  console.log(`Payment initiation requested for ${full_name} (${email})`);
  console.log(`Total: $${total}, Items: ${items.length}`);

  if (MOCK_PAYNOW) {
    const order_reference = `CL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    // In mock mode, we return a local URL to the mock gateway on the frontend
    // Assuming frontend runs on port 5173 (standard Vite)
    const browserurl = `http://localhost:5173/mock-payment-gateway?ref=${order_reference}&amount=${total}`;
    
    return res.json({
      status: "ok",
      browserurl,
      pollurl: `http://localhost:5000/api/paynow/poll?ref=${order_reference}`,
      order_reference
    });
  }

  // ELSE: Actual Paynow HTTP POST logic will go here
  // TODO: Implement actual Paynow API integration
  return res.status(501).json({ error: "Paynow integration not yet implemented in production mode." });
});

router.post("/callback", (req: Request, res: Response) => {
  console.log("Paynow callback received:", req.body);
  // Implement logic to update order status in DB
  res.sendStatus(200);
});

export default router;
