'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const CreateRoom = ({ params }: { params: { categoryId: string } }) => {
  const token = useAppSelector((state: any) => state.auth.token);
  const route = useRouter();

  const FormSchema = z.object({
    name: z.string().min(1, {
      message: 'Please enter name.',
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      if (params.categoryId !== 'new') {
        try {
          const res = await newRequest.get(
            `/api/v1/category/${params.categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const categoryData = res.data.data;

          form.reset({
            name: categoryData.name,
          });
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      }
    };

    fetchRoomData();
  }, [params.categoryId, token, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (params.categoryId === 'new') {
        try {
          const response = await newRequest.post(
            `/api/v1/category/create`,
            {
              name: data.name,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Create category success`);
          route.push('/category');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/category');
        }
      } else {
        try {
          const response = await newRequest.put(
            `/api/v1/category/update/${params.categoryId}`,
            {
              name: data.name,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Update category success`);
          route.push('/category');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/category');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }

    console.log(data);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateRoom;
