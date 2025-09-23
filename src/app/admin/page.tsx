'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Icons } from '@/app/components/icons';
import type { Hospital } from '@/lib/types';
import HospitalForm from '@/app/components/admin/hospital-form';
import DeleteHospitalDialog from '@/app/components/admin/delete-hospital-dialog';
import { getHospitals } from '@/lib/firebase/firestore';
import { Preloader } from '@/app/components/layout/preloader';

export default function AdminPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchHospitals() {
      try {
        const hospitalsData = await getHospitals();
        setHospitals(hospitalsData);
      } catch (e) {
        console.error(e);
        setError('Failed to load hospital data.');
      } finally {
        setLoading(false);
      }
    }
    fetchHospitals();
  }, [isFormOpen, isDeleteDialogOpen]);

  const handleEdit = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsFormOpen(true);
  };

  const handleDelete = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsDeleteDialogOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedHospital(null);
  };

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p className="text-destructive-foreground bg-destructive p-4 rounded-md">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Hospital Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove hospital data.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Icons.add className="mr-2 h-4 w-4" />
            Add Hospital
          </Button>
        </div>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hospitals.map((hospital) => (
              <TableRow key={hospital.id}>
                <TableCell className="font-medium">{hospital.name}</TableCell>
                <TableCell>{hospital.address}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties.slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                    {hospital.specialties.length > 3 && (
                      <Badge variant="outline">+{hospital.specialties.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Icons.moreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => handleEdit(hospital)}>
                        <Icons.edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleDelete(hospital)} className="text-destructive">
                        <Icons.trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      <HospitalForm
        isOpen={isFormOpen}
        onOpenChange={closeForm}
        hospital={selectedHospital}
      />
      <DeleteHospitalDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        hospital={selectedHospital}
      />
    </div>
  );
}
