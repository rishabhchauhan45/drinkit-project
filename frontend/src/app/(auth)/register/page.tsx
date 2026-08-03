'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(formData.age);

    if (age < 21) {
      setError('You must be 21 or older to register.');
      return;
    }

    try {
      await register({
        ...formData,
        age,
      });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <>
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Join DrinkIt to access premium drinks and exclusive deals
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Full Name"
            icon={<User className="h-4 w-4" />}
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            icon={<Mail className="h-4 w-4" />}
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              icon={<Phone className="h-4 w-4" />}
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <Input
              name="age"
              type="number"
              min="21"
              max="100"
              placeholder="Age"
              icon={<Calendar className="h-4 w-4" />}
              value={formData.age}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <Input
            name="password"
            type="password"
            placeholder="Password"
            icon={<Lock className="h-4 w-4" />}
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
            minLength={6}
          />
        </div>

        <div className="text-xs text-muted-foreground">
          By registering, you confirm that you are at least 21 years of age and agree to our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base shadow-soft-sm" 
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </>
  );
}
