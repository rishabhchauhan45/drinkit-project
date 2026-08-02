'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { setAgeVerified } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import axios from 'axios';
import { Camera, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AgeVerificationPage() {
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);

  const handleVerify = async () => {
    if (!idFile || !selfieFile) {
      setError('Please upload both your ID and a selfie to verify your age.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('idImage', idFile);
      formData.append('selfieImage', selfieFile);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai/verify-age`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.data.verified) {
        setSuccess(true);
        dispatch(setAgeVerified(true));
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(response.data.data.reason || 'Verification failed. Please try again with clear photos.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center p-4">
      <Card className="w-full max-w-lg border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-primary">Age Verification Required</CardTitle>
          <CardDescription>
            You must be 21 or older to order from DrinkIt. Please verify your identity using our AI system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-md bg-green-500/15 p-3 text-sm text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              Verification successful! Redirecting...
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* ID Upload */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:bg-muted/50">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Government ID</p>
              <p className="text-center text-xs text-muted-foreground">Driver's License or Passport</p>
              <label className="mt-2 cursor-pointer rounded-md bg-secondary px-3 py-1 text-xs font-medium hover:bg-secondary/80">
                Choose File
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                />
              </label>
              {idFile && <span className="mt-2 text-xs text-primary truncate max-w-full">{idFile.name}</span>}
            </div>

            {/* Selfie Upload */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:bg-muted/50">
              <Camera className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Live Selfie</p>
              <p className="text-center text-xs text-muted-foreground">Take a quick selfie to match your ID</p>
              <label className="mt-2 cursor-pointer rounded-md bg-secondary px-3 py-1 text-xs font-medium hover:bg-secondary/80">
                Choose File
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                />
              </label>
              {selfieFile && <span className="mt-2 text-xs text-primary truncate max-w-full">{selfieFile.name}</span>}
            </div>
          </div>

        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleVerify} 
            disabled={loading || success || !idFile || !selfieFile}
          >
            {loading ? 'Running AI Verification...' : 'Verify Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
