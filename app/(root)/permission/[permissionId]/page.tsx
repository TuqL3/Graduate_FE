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

const CreateRoom = ({ params }: { params: { permissionId: string } }) => {
  const token = useAppSelector((state: any) => state.auth.token);
  const route = useRouter();

  const FormSchema = z.object({
    permission_name: z.string().min(1, {
      message: 'Please enter permission name.',
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      permission_name: '',
    },
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      if (params.permissionId !== 'new') {
        try {
          const res = await newRequest.get(`/api/v1/permission/${params.permissionId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const permissionData = res.data.data;

          form.reset({
            permission_name: permissionData.permission_name,
          });
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      }
    };

    fetchRoomData();
  }, [params.permissionId, token, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (params.permissionId === 'new') {
        try {
          const response = await newRequest.post(
            `/api/v1/permission/create`,
            {
              permission_name: data.permission_name,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Create permission success`);
          route.push('/permission');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/permission');
        }
      } else {
        try {
          const response = await newRequest.put(
            `/api/v1/permission/update/${params.permissionId}`,
            {
              permission_name: data.permission_name,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Update permission success`);
          route.push('/permission');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/permission');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="permission_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permission name</FormLabel>
              <FormControl>
                <Input placeholder="Permission name" {...field} />
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
