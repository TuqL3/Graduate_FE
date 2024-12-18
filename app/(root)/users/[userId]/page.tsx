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
import { useEffect, useState } from 'react';
import { User } from '../columns';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CreateUser = ({ params }: { params: { userId: string } }) => {
  const [roles, setRoles] = useState([]);
  const route = useRouter();
  const FormSchema = z.object({
    username:
      params.userId == 'new'
        ? z.string().min(1, {
            message: 'Enter username.',
          })
        : z.string().optional(),
    roles: z.any(),
    full_name: z.string().min(2, {
      message: 'Fullname must be at least 2 characters.',
    }),
    email: z.string().min(5, {
      message: 'Email must be at least 5 characters.',
    }),
    phone: z.string().min(10, {
      message: 'Phone must be at least 10 characters.',
    }),
    password:
      params.userId === 'new'
        ? z
            .string()
            .min(8, { message: 'Password must be at least 8 characters.' })
        : z.string().optional(),
  });

  const token = useAppSelector((state: any) => state.auth.token);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      full_name: '',
      roles: '',
      email: '',
      phone: '',
      password: params.userId === 'new' ? '' : undefined,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (params.userId !== 'new') {
        try {
          const res = await newRequest.get(`/api/v1/user/${params.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = res.data.data;

          form.reset({
            username: userData.username,
            roles: String(userData.roles[0].id),
            full_name: userData.full_name,
            email: userData.email,
            phone: userData.phone,
          });
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    const fetchRoleData = async () => {
      try {
        const res = await newRequest.get('/api/v1/role', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoles(res.data.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoleData();
    fetchData();
  }, [params.userId, token, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (params.userId === 'new') {
        try {
          await newRequest.post(
            '/api/v1/user/register',
            {
              username: data.username,
              password: data.password,
              full_name: data.full_name,
              email: data.email,
              phone: data.phone,
              roles: [parseInt(data.roles)],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success('Create user success');
          route.push('/users');
        } catch (error) {
          toast.error('Something went wrong');
        }
      } else {
        try {
          await newRequest.put(
            `/api/v1/user/update/${params.userId}`,
            {
              full_name: data.full_name,
              email: data.email,
              phone: data.phone,
              roles: [parseInt(data.roles)],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success('Update user success');
          route.push('/users');
        } catch (error) {
          toast.error('Something went wrong');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {params.userId == 'new' && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fullname</FormLabel>
              <FormControl>
                <Input placeholder="Fullname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {params.userId == 'new' && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((item: any) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateUser;
