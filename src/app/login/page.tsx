
'use client';

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

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

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

      const profile = await getUserProfile(userCredential.user.uid);
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Login Successful", description: "Welcome back, admin!" });
        router.push('/admin');
    } catch (error) {
        if (error instanceof FirebaseError && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await createUserProfile(userCredential.user.uid, { email: userCredential.user.email!, role: 'admin' });
                toast({ title: "Admin Account Created", description: "You have been logged in automatically." });
                router.push('/admin');
            } catch (creationError) {
                if (creationError instanceof FirebaseError) {
                    toast({ variant: 'destructive', title: 'Creation Error', description: creationError.message });
                } else {
                    toast({ variant: 'destructive', title: 'Creation Error', description: 'Could not create admin account.' });
                }
            }
        } else if (error instanceof FirebaseError) {
             toast({ variant: 'destructive', title: 'Login Error', description: error.message });
        } else {
             toast({ variant: 'destructive', title: 'Login Error', description: 'An unexpected error occurred.' });
        }
    }
  };


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
