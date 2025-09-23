
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/app/components/icons';
import type { Hospital } from '@/lib/types';
import HospitalForm from '@/app/components/admin/hospital-form';
import DeleteHospitalDialog from '@/app/components/admin/delete-hospital-dialog';
import { getHospitals } from '@/lib/firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const hospitalsData = await getHospitals();
      setHospitals(hospitalsData);
    } catch (e) {
      setError('Failed to load hospital data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleAddNew = () => {
    setSelectedHospital(null);
    setIsFormOpen(true);
  };

  const handleEdit = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsFormOpen(true);
  };

  const handleDelete = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsDeleteDialogOpen(true);
  };

  const onFormSuccess = () => {
    setIsFormOpen(false);
    fetchHospitals();
  };

  const onDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    fetchHospitals();
  };


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
    <div className="container py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">Hospital Management</h1>
      </div>
      
      <div className="flex justify-center">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle>Existing Hospitals</CardTitle>
              <CardDescription>Browse and manage all registered medical facilities.</CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <Icons.add className="mr-2 h-4 w-4" /> Add Hospital
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
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
                      <TableCell className="font-medium whitespace-nowrap">{hospital.name}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{hospital.address}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 min-w-[200px]">
                          {hospital.specialties.slice(0, 3).map((s) => (
                            <Badge key={s} variant="secondary" className="whitespace-nowrap">{s}</Badge>
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
                            <DropdownMenuItem onSelect={() => handleDelete(hospital)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Icons.trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <HospitalForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        hospital={selectedHospital}
        onSuccess={onFormSuccess}
      />
      <DeleteHospitalDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        hospital={selectedHospital}
        onSuccess={onDeleteSuccess}
      />
    </div>
  );
}
