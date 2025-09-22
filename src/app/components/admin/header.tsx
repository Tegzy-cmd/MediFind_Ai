'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/app/components/icons';
import HospitalForm from './hospital-form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: 'Signed out successfully.' });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to sign out.' });
    }
  };


  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Hospital Management</h1>
            <p className="text-muted-foreground">Add, edit, or remove hospital data.</p>
        </div>
        <div className='flex items-center gap-2'>
            <Button onClick={() => setIsFormOpen(true)}>
                <Icons.add className="mr-2 h-4 w-4" />
                Add Hospital
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Icons.user className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <HospitalForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
}
