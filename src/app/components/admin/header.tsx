'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/app/components/icons';
import HospitalForm from './hospital-form';

export function Header() {
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        </div>
      </div>
      <HospitalForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
}
