'use client';
import { useState } from 'react';
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
import HospitalForm from './hospital-form';
import DeleteHospitalDialog from './delete-hospital-dialog';

export default function HospitalTable({ hospitals }: { hospitals: Hospital[] }) {
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleEdit = (hospital: Hospital) => {
        setSelectedHospital(hospital);
        setIsFormOpen(true);
    };

    const handleDelete = (hospital: Hospital) => {
        setSelectedHospital(hospital);
        setIsDeleteDialogOpen(true);
    }

    const closeForm = () => {
      setIsFormOpen(false);
      setSelectedHospital(null);
    }
    
  return (
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
    </Card>
  );
}
