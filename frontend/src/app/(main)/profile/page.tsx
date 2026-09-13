'use client';

import { User, Phone, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
              fallback={user?.name || 'U'}
              className="h-24 w-24 shrink-0 shadow-soft-sm"
            />
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              
              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  Age Verified (21+)
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  <User className="h-4 w-4" />
                  {user?.role === 'ADMIN' ? 'Admin Account' : 'Member'}
                </div>
              </div>
            </div>
            <Button variant="outline">Edit Avatar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b px-8 py-5">
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <Input 
                value={user?.name} 
                icon={<User className="h-4 w-4" />} 
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <Input 
                value={user?.email} 
                icon={<Mail className="h-4 w-4" />} 
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
              <Input 
                value={user?.phone} 
                icon={<Phone className="h-4 w-4" />} 
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Age</label>
              <Input 
                value="21+" 
                icon={<Calendar className="h-4 w-4" />} 
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
