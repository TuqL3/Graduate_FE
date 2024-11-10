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

const CreateRoom = ({ params }: { params: { roomId: string } }) => {
  const token = useAppSelector((state: any) => state.auth.token);
  const route = useRouter();


  const FormSchema = z.object({
    name: z.string().min(1, {
      message: 'Please enter room name.',
    }),
    status: z.string().min(1, {
      message: 'Please enter room name.',
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      status: "",
    },
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      if (params.roomId !== 'new') {
        try {
          const res = await newRequest.get(`/api/v1/room/${params.roomId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const roomData = res.data.data;

          form.reset({
            name: roomData.name,
            status: roomData.status,
          });
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      }
    };

    fetchRoomData();
  }, [params.roomId, token, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (params.roomId === 'new') {
        try {
          const response = await newRequest.post(
            `/api/v1/room/create`,
            {
              name: data.name,
              status: data.status,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Create room success`);
          route.push('/rooms');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/rooms');
        }
      } else {
        try {
          const response = await newRequest.put(
            `/api/v1/room/update/${params.roomId}`,
            {
              name: data.name,
              status: data.status,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Update room success`);
          route.push('/rooms');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/rooms');
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
              <FormLabel>Room name</FormLabel>
              <FormControl>
                <Input placeholder="Room name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="maintenance" />
                    </FormControl>
                    <FormLabel className="font-normal">Maintenance</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="in_use" />
                    </FormControl>
                    <FormLabel className="font-normal">In use</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="available" />
                    </FormControl>
                    <FormLabel className="font-normal">Available</FormLabel>
                  </FormItem>
                </RadioGroup>
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
