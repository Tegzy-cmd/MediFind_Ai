
'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteHospital } from '@/lib/firebase/firestore';
import type { Hospital } from '@/lib/types';

interface DeleteHospitalDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    hospital: Hospital | null;
    onSuccess: () => void;
}

export default function DeleteHospitalDialog({ isOpen, onOpenChange, hospital, onSuccess }: DeleteHospitalDialogProps) {
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!hospital) return;
        try {
            await deleteHospital(hospital.id);
            toast({ title: 'Success', description: 'Hospital deleted successfully.' });
            onSuccess();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete hospital.' });
        }
    }
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the hospital
            <span className="font-bold"> {hospital?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
