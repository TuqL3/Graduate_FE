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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CreateRoom = ({ params }: { params: { scheduleId: string } }) => {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAppSelector((state: any) => state.auth.token);
  const route = useRouter();

  const FormSchema = z.object({
    roomName: z.string().min(1, {
      message: 'Please enter room name.',
    }),
    userName: z.string().min(1, {
      message: 'Please enter user name.',
    }),
    start: z.preprocess(
      (val) =>
        typeof val === 'string' || val instanceof Date ? new Date(val) : val,
      z.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Please enter a valid start date and time.',
      }),
    ),
    end: z.preprocess(
      (val) =>
        typeof val === 'string' || val instanceof Date ? new Date(val) : val,
      z.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Please enter a valid end date and time.',
      }),
    ),
    title: z.string().min(1, {
      message: 'Please enter schedule title.',
    }),
    description: z.string().min(1, {
      message: 'Please enter schedule description.',
    }),
    status: z.string().min(1, {
      message: 'Please enter status.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roomName: '',
      userName: '',
      title: '',
      description: '',
      start: new Date(),
      end: new Date(),
      status: '',
    },
  });
  const formatDateForDB = (date: Date): string => {
    return date.toISOString();
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch rooms and users in parallel
        const [roomsResponse, usersResponse] = await Promise.all([
          newRequest.get('/api/v1/room', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          newRequest.get('/api/v1/user', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setRooms(roomsResponse.data.data);
        setUsers(usersResponse.data.data);

        // If we have a scheduleId, fetch the schedule data
        if (params.scheduleId) {
          const scheduleResponse = await newRequest.get(
            `/api/v1/schedule/${params.scheduleId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          const scheduleData = scheduleResponse.data.data;

          form.reset({
            roomName: String(scheduleData.room.id),
            userName: String(scheduleData.user.id),
            title: scheduleData.title,
            description: scheduleData.description,
            start: new Date(scheduleData.start_time),
            end: new Date(scheduleData.end_time),
            status: scheduleData.status,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.scheduleId, token, form]);

  // async function onSubmit(data: z.infer<typeof FormSchema>) {
  //   try {
  //     await newRequest.put(
  //       `/api/v1/schedule/update/${params.scheduleId}`,
  //       {
  //         location: parseInt(data.roomName),
  //         participants: parseInt(data.userName),
  //         title: data.title,
  //         description: data.description,
  //         start_time: data.start,
  //         end_time: data.end,
  //         status: data.status,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     toast.success('Update schedule success');
  //     route.push('/schedule');
  //   } catch (error) {
  //     console.error('Error:', error);
  //     toast.error('Something went wrong');
  //   }

  //   console.log(data);
  // }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const start_time = data.start.toISOString();
      const end_time = data.end.toISOString();

      await newRequest.put(
        `/api/v1/schedule/update/${params.scheduleId}`,
        {
          location: parseInt(data.roomName),
          participants: parseInt(data.userName),
          title: data.title,
          description: data.description,
          start: start_time, 
          end: end_time, 
          status: data.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success('Update schedule success');
      route.push('/schedule');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }

    console.log(data);
  }

  const toLocalDatetimeString = (date: Date): string => {
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString();
    return localISOTime.slice(0, 16);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="roomName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rooms.map((item: any) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((item: any) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
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
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={field.value ? toLocalDatetimeString(field.value) : ''}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={field.value ? toLocalDatetimeString(field.value) : ''}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
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
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="pending" />
                    </FormControl>
                    <FormLabel className="font-normal">Pending</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="resolve" />
                    </FormControl>
                    <FormLabel className="font-normal">Resolve</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="reject" />
                    </FormControl>
                    <FormLabel className="font-normal">Reject</FormLabel>
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
