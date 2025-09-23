
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { hospitalSchema, type HospitalFormValues } from '@/lib/schema';
import { addHospital, updateHospital } from '@/lib/firebase/firestore';
import type { Hospital } from '@/lib/types';
import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HospitalFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hospital?: Hospital | null;
  onSuccess: () => void;
}

export default function HospitalForm({ isOpen, onOpenChange, hospital, onSuccess }: HospitalFormProps) {
  const { toast } = useToast();

  const form = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      name: '',
      address: '',
      contact: '',
      lat: 0,
      lng: 0,
      specialties: '',
      services: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (hospital) {
        form.reset({
          name: hospital.name,
          address: hospital.address,
          contact: hospital.contact,
          lat: hospital.coordinates.lat,
          lng: hospital.coordinates.lng,
          specialties: hospital.specialties.join(', '),
          services: hospital.services.join(', '),
        });
      } else {
          form.reset({
              name: '',
              address: '',
              contact: '',
              lat: 0,
              lng: 0,
              specialties: '',
              services: '',
          });
      }
    }
  }, [hospital, form, isOpen]);

  const onSubmit = async (data: HospitalFormValues) => {
    try {
      if (hospital) {
        await updateHospital(hospital.id, data);
        toast({ title: 'Success', description: 'Hospital updated successfully.' });
      } else {
        await addHospital(data);
        toast({ title: 'Success', description: 'Hospital added successfully.' });
      }
      onSuccess();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{hospital ? 'Edit Hospital' : 'Add New Hospital'}</DialogTitle>
          <DialogDescription>
            {hospital ? 'Update the details for this hospital.' : 'Fill in the details for the new hospital.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
                <FormField name="contact" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
              </div>
              <FormField name="address" control={form.control} render={({ field }) => (
                  <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="lat" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl><Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
                <FormField name="lng" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl><Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
              </div>
              <FormField name="specialties" control={form.control} render={({ field }) => (
                  <FormItem>
                      <FormLabel>Specialties</FormLabel>
                      <FormControl><Input placeholder="Cardiology, Neurology, ..." {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              <FormField name="services" control={form.control} render={({ field }) => (
                  <FormItem>
                      <FormLabel>Services</FormLabel>
                      <FormControl><Input placeholder="MRI, X-Ray, ..." {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Hospital'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
