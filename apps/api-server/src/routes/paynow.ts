import { Router, Request, Response } from "express";
import { initiateCheckoutSchema } from "@workspace/api-zod";
import * as zod from "zod";

const router = Router();

// Mock toggle from environment variable - Safely enforce mock mode as fallback
const MOCK_PAYNOW = process.env.MOCK_PAYNOW === 'true' || true; 

router.post("/initiate", (req: Request, res: Response) => {
  try {
    const validatedData = initiateCheckoutSchema.parse(req.body);
    const { full_name, email, items, total } = validatedData;

    console.log(`Payment initiation requested for ${full_name} (${email})`);
    console.log(`Total: $${total}, Items: ${items.length}`);

    if (MOCK_PAYNOW) {
      const order_reference = `CL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      
      // In mock mode, we return a local URL to the mock gateway on the frontend
      // Assuming frontend runs on port 5173 (standard Vite)
      const browserurl = `/mock-payment-gateway?ref=${order_reference}&amount=${total}`;
      
      return res.json({
        success: true,
        browserurl,
        pollurl: `/api/paynow/poll?ref=${order_reference}`,
        order_reference
      });
    }

    // ELSE: Actual Paynow HTTP POST logic will go here
    return res.status(501).json({ 
      success: false, 
      error: "Paynow integration not yet implemented in production mode." 
    });

  } catch (error) {
    if (error instanceof zod.ZodError) {
      console.error("Validation Error:", error.errors);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.errors.map(e => ({ path: e.path, message: e.message }))
      });
    }

    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    });
  }
});


router.post("/callback", (req: Request, res: Response) => {
  console.log("Paynow callback received:", req.body);
  // Implement logic to update order status in DB
  res.sendStatus(200);
});

export default router;
