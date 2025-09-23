
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { loginSchema, type LoginFormValues } from '@/lib/schema';
import { auth } from '@/lib/firebase/config';
import { FirebaseError } from 'firebase/app';
import { Icons } from '@/app/components/icons';
import { createUserProfile, getUserProfile } from '@/lib/firebase/firestore';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && userProfile?.role === 'admin') {
      router.replace('/admin');
    }
  }, [user, userProfile, loading, router]);


  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'omarakabenjamin3@gmail.com',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      let profile = await getUserProfile(userCredential.user.uid);

      // If for some reason the profile doesn't exist, create it.
      if (!profile) {
        await createUserProfile(userCredential.user.uid, { email: userCredential.user.email! });
        profile = await getUserProfile(userCredential.user.uid);
      }

      if (profile?.role !== 'admin') {
         toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'You do not have permission to access the admin dashboard.',
        });
        auth.signOut();
        return;
      }
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/admin');
    } catch (error) {
      let title = 'An error occurred';
      let description = 'Please try again later.';

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            title = 'Invalid Credentials';
            description = 'The email or password you entered is incorrect.';
            break;
          case 'auth/too-many-requests':
            title = 'Too Many Attempts';
            description = 'Access to this account has been temporarily disabled. Please reset your password or try again later.';
            break;
          default:
            title = 'Authentication Error';
            description = error.message;
        }
      }
      
      toast({
        variant: 'destructive',
        title,
        description,
      });
    }
  };
  
    const handleAutoFillAndCreate = async () => {
    const email = 'omarakabenjamin3@gmail.com';
    const password = 'Benjamin007$';
    form.setValue('email', email);
    form.setValue('password', password);

    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Login Successful", description: "Welcome back, admin!" });
        router.push('/admin');
    } catch (error) {
        if (error instanceof FirebaseError && error.code === 'auth/user-not-found') {
            // User does not exist, so create the account
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await createUserProfile(userCredential.user.uid, { email: userCredential.user.email!, role: 'admin' });
                toast({ title: "Admin Account Created", description: "You have been logged in automatically." });
                router.push('/admin');
            } catch (creationError) {
                const ce = creationError as FirebaseError;
                toast({ variant: 'destructive', title: 'Account Creation Error', description: ce.message || 'Could not create admin account.' });
            }
        } else if (error instanceof FirebaseError) {
            // Handle other Firebase errors during sign-in (e.g., wrong password)
            let description = error.message;
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                description = 'The password for the admin account is incorrect.';
            }
             toast({ variant: 'destructive', title: 'Login Error', description });
        } else {
             // Handle non-Firebase errors
             toast({ variant: 'destructive', title: 'Login Error', description: 'An unexpected error occurred.' });
        }
    }
  };

  if (loading || (user && userProfile)) {
    return null; // Render nothing while loading or redirecting
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
         <div className="mx-auto mb-2">
            <Icons.hospital className="h-10 w-10 text-primary" />
         </div>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@medifind.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Icons.sparkles className="animate-spin mr-2"/>}
              Sign In
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-xs text-muted-foreground">
             Use the provided credentials or click below.
        </div>
         <Button variant="link" className="w-full mt-2" onClick={handleAutoFillAndCreate}>
              Auto-fill & Login/Create Admin
        </Button>
      </CardContent>
    </Card>
  );
}
