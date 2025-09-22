import { getHospitals } from '@/lib/firebase/firestore';
import HospitalTable from '../components/admin/hospital-table';
import { Header } from '../components/admin/header';

export const revalidate = 0; // Disable caching for this page

export default async function AdminPage() {
  const hospitals = await getHospitals();

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container py-8">
        <Header />
        <HospitalTable hospitals={hospitals} />
      </div>
    </div>
  );
}
