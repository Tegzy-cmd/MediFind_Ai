'use client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-8 space-y-4 w-full">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return <div className='bg-secondary min-h-screen'>{children}</div>;
}
