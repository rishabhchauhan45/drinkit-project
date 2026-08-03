'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, CreditCard, MapPin, MapPinned, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useCreateOrder } from '@/hooks/useOrders';

const steps = ['Address', 'Payment', 'Review'];

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { items, subtotal, tax, deliveryFee, total, savings, isEmpty, clear } = useCart();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Redirect if empty or not authenticated
  if (isEmpty && !isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
      </div>
    );
  }

  if (!isAuthenticated && !isSuccess) {
    router.push('/login?returnUrl=/checkout');
    return null;
  }

  const handleNext = () => {
    if (currentStep === 0 && !address) return;
    if (currentStep < 2) setCurrentStep(curr => curr + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      const order = await createOrder({
        products: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
        address,
        paymentMethod: paymentMethod.toUpperCase(),
      });
      setOrderId(order.id);
      setIsSuccess(true);
      clear();
    } catch (error) {
      console.error('Failed to create order', error);
      // In a real app, show a toast notification here
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 text-center flex flex-col items-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Thank you for your purchase. Your order #{orderId.slice(-6).toUpperCase()} is being prepared.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push('/products')}>Continue Shopping</Button>
          <Button onClick={() => router.push(`/profile/orders/${orderId}`)}>Track Order</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-muted -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-primary -z-10 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 2) * 100}%` }}
        />
        
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center gap-2 bg-background px-4">
              <div 
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-colors ${
                  isActive || isCompleted 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : 'border-muted bg-background text-muted-foreground'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : index + 1}
              </div>
              <span className={`text-sm font-medium ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Delivery Address
                    </h2>
                    
                    {/* User's existing addresses could be mapped here */}
                    <div className="space-y-4">
                      <div className="rounded-xl border border-primary bg-primary/5 p-4 flex gap-4 cursor-pointer">
                        <MapPinned className="h-6 w-6 text-primary shrink-0" />
                        <div>
                          <p className="font-semibold">{user?.name}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            123, Tech Park, Cyber City, Bangalore - 560001
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{user?.phone}</p>
                        </div>
                        <div className="ml-auto">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or add new address</span>
                        </div>
                      </div>

                      <Input
                        placeholder="Enter complete address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button size="lg" onClick={handleNext} disabled={!address && currentStep === 0}>
                    Continue to Payment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Method
                    </h2>
                    
                    <div className="space-y-3">
                      {[
                        { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                        { id: 'upi', label: 'UPI / Google Pay', icon: CheckCircle2 },
                        { id: 'cod', label: 'Cash on Delivery', icon: CircleDollarSign },
                      ].map((method) => {
                        const Icon = method.icon;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as any)}
                            className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${
                              paymentMethod === method.id 
                                ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                                : 'hover:bg-muted'
                            }`}
                          >
                            <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${paymentMethod === method.id ? 'border-primary' : 'border-muted-foreground'}`}>
                              {paymentMethod === method.id && <div className="h-3 w-3 rounded-full bg-primary" />}
                            </div>
                            <Icon className={`h-5 w-5 ${paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-medium">{method.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="lg" onClick={handleBack}>
                    Back
                  </Button>
                  <Button size="lg" onClick={handleNext}>
                    Review Order
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                    
                    {/* Items List */}
                    <div className="space-y-4">
                      {items.map(item => (
                        <div key={item.productId} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                          <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0 border">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl bg-muted/50 p-4 mt-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">Delivering to:</span>
                        <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setCurrentStep(0)}>Change</Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address || '123, Tech Park, Cyber City, Bangalore - 560001'}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">Paying via:</span>
                        <Button variant="link" size="sm" className="h-auto p-0" onClick={() => setCurrentStep(1)}>Change</Button>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : 'Credit / Debit Card'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="lg" onClick={handleBack} disabled={isPending}>
                    Back
                  </Button>
                  <Button size="lg" onClick={handlePlaceOrder} isLoading={isPending}>
                    Place Order & Pay ₹{Math.round(total).toLocaleString('en-IN')}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-soft-md">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-6">Order Summary</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({items.length})</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="font-medium text-emerald-600">Free</span>
                  ) : (
                    <span className="font-medium">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes (18% GST)</span>
                  <span className="font-medium">₹{Math.round(tax).toLocaleString('en-IN')}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600 pb-4 border-b border-dashed">
                    <span>Discount</span>
                    <span className="font-medium">-₹{savings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                {!savings && <div className="border-b border-dashed pb-4" />}
                
                <div className="flex justify-between text-base font-bold pt-2">
                  <span>Total Amount</span>
                  <span>₹{Math.round(total).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {savings > 0 && (
                <div className="mt-6 rounded-lg bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700 border border-emerald-100">
                  You will save ₹{savings.toLocaleString('en-IN')} on this order!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
