import React from 'react';
import { useForm } from"react-hook-form";
import * as z from"zod";
import { zodResolver } from"@hookform/resolvers/zod";
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from"@/components/ui/form";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { useCart } from '@/context/CartContext';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { createOrderFromCart } from '@/services/orderService';

const BLUE = '#0077B6';

const checkoutSchema = z.object({
  full_name: z.string().min(2,"Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10,"Valid phone number is required"),
  whatsapp_number: z.string().min(10,"Valid WhatsApp number is required"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cart, removeFromCart, total, setCheckoutInfo } = useCart();
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      full_name:"",
      email:"",
      phone:"",
      whatsapp_number:"",
    },
  });

  const onSubmit = async (values: CheckoutValues) => {
    try {
      // Persist customer info so it survives if needed
      setCheckoutInfo(values);

      const cartItems = cart.map(item => ({ 
        id: item.id, 
        title: item.title, 
        price: Number(item.price) 
      }));

      const { orderId, paymentId } = await createOrderFromCart(values, cartItems, Number(total));
      
      // Clear the local cart if needed, but maybe wait for success? 
      // The user clears it on success page currently.
      
      navigate(`/mock-payment/${orderId}/${paymentId}`);
    } catch (error) {
      toast({
        variant:"destructive",
        title:"Payment Error",
        description: error instanceof Error ? error.message :"Failed to connect to the server.",
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-32  min-h-screen text-center px-6">
        <Helmet>
          <title>Cart Empty | Civil Legacy Consultancy</title>
        </Helmet>
        <h2 className="text-4xl font-black  uppercase tracking-tighter mb-8">Your Cart is Empty</h2>
        <Button
          onClick={() => navigate('/Services')}
          className="bg-[#0077B6]  px-12 h-16 font-black uppercase tracking-widest rounded-2xl"
        >
          Browse Services
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32  min-h-screen  px-6 lg:px-12 text-left">
      <Helmet>
        <title>Checkout | Civil Legacy Consultancy</title>
        <meta name="description" content="Finalize your order for Civil Legacy engineering services." />
      </Helmet>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left: Cart Items */}
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Your <span style={{ color: BLUE }}>Order</span></h2>
          <div className="space-y-6">
            {cart.map((item, idx) => (
              <div key={idx} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 rounded-3xl flex justify-between items-center group">
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tighter  mb-1">{item.title}</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.pillar}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-lg font-black">${item.price?.toLocaleString()}</span>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-8 border-t border-black/10 dark:border-white/10 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Total Amount</span>
            <span className="text-4xl font-black">${total.toLocaleString()}</span>
          </div>
        </div>

        {/* Right: Checkout Form */}
        <div className="bg-black/5 dark:bg-white/5 p-12 lg:p-16 rounded-[3rem] border border-black/10 dark:border-white/10 relative overflow-hidden">
          <h3 className="text-3xl font-black  uppercase tracking-tighter mb-4">Checkout</h3>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-12">Complete your service booking</p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="YOUR FULL NAME" {...field} className="bg-transparent border-black/10 dark:border-white/10  font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="EMAIL@EXAMPLE.COM" {...field} className="bg-transparent border-black/10 dark:border-white/10  font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="07XX XXX XXX" {...field} className="bg-transparent border-black/10 dark:border-white/10  font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsapp_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="263XXXXXXXXX" {...field} className="bg-transparent border-black/10 dark:border-white/10  font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-20 bg-[#0077B6] hover:bg-[#0077B6]/80  font-black uppercase tracking-[0.4em] text-xs rounded-2xl shadow-2xl transition-all"
              >
                Pay with Paynow
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
