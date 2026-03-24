import { z } from "zod";

export const initiateCheckoutSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  whatsapp_number: z.string().min(10, "Valid WhatsApp number is required"),
  items: z.array(z.object({
    id: z.string().or(z.number()),
    title: z.string(),
    price: z.number(),
  })),
  total: z.number(),
});

export type InitiateCheckoutInput = z.infer<typeof initiateCheckoutSchema>;
