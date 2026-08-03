'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // clear error on type
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(formData);
      const returnUrl = searchParams.get('returnUrl') || '/';
      router.push(returnUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <>
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            icon={<Mail className="h-4 w-4" />}
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <div>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              icon={<Lock className="h-4 w-4" />}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <div className="mt-2 text-right">
              <Link 
                href="/forgot-password" 
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base shadow-soft-sm" 
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create one now
        </Link>
      </div>
    </>
  );
}
