'use client';

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
import { useEffect, useState } from 'react';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { permission } from 'process';
import toast from 'react-hot-toast';

const CreateRoom = ({ params }: { params: { roleId: string } }) => {
  const [permissionList, setPermissionList] = useState([]);
  const token = useAppSelector((state: any) => state.auth.token);
  const route = useRouter();

  const FormSchema = z.object({
    role_name: z.string().min(1, {
      message: 'Please enter role name.',
    }),
    permissions: z.array(z.any()),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role_name: '',
      permissions: [],
    },
  });

  useEffect(() => {
    const fetchPermission = async () => {
      if (!token) return;

      try {
        const res = await newRequest.get('/api/v1/permission', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const permissionData = res.data.data.map((permission: any) => ({
          id: permission.id,
          permission_name: permission.permission_name,
        }));

        setPermissionList(permissionData);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    const fetchRoleData = async () => {
      if (params.roleId !== 'new') {
        try {
          const res = await newRequest.get(`/api/v1/role/${params.roleId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const roleData = res.data.data;

          form.reset({
            role_name: roleData.role_name,
            permissions: roleData.permissions.map((item: any) => item.id),
          });
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      }
    };
    fetchRoleData();
    fetchPermission();
  }, [token]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (params.roleId === 'new') {
        try {
          const response = await newRequest.post(
            `/api/v1/role/create`,
            {
              role_name: data.role_name,
              permissions: data.permissions,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Create role success`);
          route.push('/role');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/role');
        }
      } else {
        try {
          const response = await newRequest.put(
            `/api/v1/role/update/${params.roleId}`,
            {
              role_name: data.role_name,
              permissions: [...data.permissions],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Update role success`);
          route.push('/role');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/role');
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
          name="role_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role name</FormLabel>
              <FormControl>
                <Input placeholder="Role name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permissions"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Permissions</FormLabel>
                <FormDescription>
                  Select the permissions you want to assign.
                </FormDescription>
              </div>
              {permissionList.map((item: any) => (
                <FormItem
                  key={item.id}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value.includes(item.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newValue = checked
                          ? [...field.value, item.id]
                          : field.value.filter((value) => value !== item.id);
                        field.onChange(newValue);
                      }}
                      className="form-checkbox"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {item.permission_name}
                  </FormLabel>
                </FormItem>
              ))}
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
