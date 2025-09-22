'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/app/components/icons';

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in more detail.'),
});

type FormValues = z.infer<typeof formSchema>;

interface SymptomCheckerProps {
    onSymptomSubmit: (symptoms: string) => void;
    isRanking: boolean;
}

export function SymptomChecker({ onSymptomSubmit, isRanking }: SymptomCheckerProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    onSymptomSubmit(data.symptoms);
  };
  
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                    <FormLabel className='flex items-center gap-2 font-semibold'>
                        <Icons.sparkles className='h-4 w-4 text-primary' />
                        <span>AI Symptom Analysis</span>
                    </FormLabel>
                    <p className='text-sm text-muted-foreground'>Describe your symptoms to get AI-ranked hospital recommendations.</p>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Chest pain' or 'Possible broken arm'"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isRanking}>
              {isRanking ? (
                <>
                 <Icons.sparkles className="mr-2 h-4 w-4 animate-spin" />
                 Ranking...
                </>
              ) : (
                <>
                <Icons.sparkles className="mr-2 h-4 w-4" />
                Find Best Facility
                </>
              )
              }
            </Button>
        </form>
    </Form>
  );
}
