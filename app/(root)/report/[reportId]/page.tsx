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
import { useAppSelector } from '@/lib/redux/hooks';
import { useEffect, useState } from 'react';
import { Room } from '../../rooms/columns';
import { useRouter } from 'next/navigation';
import { newRequest } from '@/lib/newRequest';
import toast from 'react-hot-toast';

const CreateReport = ({ params }: { params: { reportId: string } }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const user = useAppSelector((state: any) => state.auth.user);
  const token = useAppSelector((state: any) => state.auth.token);
  const route = useRouter();

  const FormSchema = z.object({
    room: z.string().min(1, {
      message: 'Please select a room.',
    }),
    type: z.enum(['computer', 'tandch', 'aircondition'], {
      required_error: 'You need to select a notification type.',
    }),
    idEquipment: z.any(),
    description: z.string().min(1, {
      message: 'Description must be at least 10 characters.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      room: '',
      type: undefined,
      idEquipment: '',
      description: '',
    },
  });

  useEffect(() => {
    const fetchRoom = async () => {
      const res = await newRequest.get('/api/v1/room', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRooms(res.data.data);
    };

    const fetchReportData = async () => {
      if (params.reportId !== 'new') {
        try {
          const res = await newRequest.get(
            `/api/v1/report/${params.reportId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const reportData = res.data.data;

          form.reset({
            room: String(reportData.room.id),
            type: reportData.equipment_type,
            idEquipment: reportData.equipment_id,
            description: reportData.description,
          });
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      }
    };

    fetchRoom();
    fetchReportData();
  }, [params.reportId, token, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (params.reportId === 'new') {
        try {
          const response = await newRequest.post(
            `/api/v1/report/create`,
            {
              user_id: user.id,
              room_id: parseInt(data.room),
              equipment_id: data.idEquipment,
              equipment_type: data.type,
              description: data.description,
              status: 'pending',
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Create report success`);
          route.push('/report');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/report');
        }
      } else {
        try {
          const response = await newRequest.put(
            `/api/v1/report/update/${params.reportId}`,
            {
              user_id: user.id,
              room_id: parseInt(data.room),
              equipment_id: data.idEquipment,
              equipment_type: data.type,
              description: data.description,
              status: 'pending',
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Update report success`);
          route.push('/report');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/report');
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
          name="room"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rooms.map((item: any, index: any) => {
                    return (
                      <SelectItem key={index} value={String(item.id)}>
                        {item.room_name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="computer" />
                    </FormControl>
                    <FormLabel className="font-normal">Computer</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="tandch" />
                    </FormControl>
                    <FormLabel className="font-normal">Table & Chair</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="aircondition" />
                    </FormControl>
                    <FormLabel className="font-normal">Air condition</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idEquipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Id Equipment</FormLabel>
              <FormControl>
                <Input placeholder="Id equipment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  className="resize-none"
                  {...field}
                />
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

export default CreateReport;
