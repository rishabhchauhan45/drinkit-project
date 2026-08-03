'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <>
      <Link href="/login" className="mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Link>

      {!isSubmitted ? (
        <>
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
            <p className="text-sm text-muted-foreground">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />

            <Button 
              type="submit" 
              className="w-full h-12 text-base shadow-soft-sm" 
              isLoading={isLoading}
            >
              Reset Password
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-6 py-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to <br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <Button 
            className="w-full h-12 text-base" 
            onClick={() => setIsSubmitted(false)}
            variant="outline"
          >
            Didn't receive the email? Click to resend
          </Button>
        </div>
      )}
    </>
  );
}
