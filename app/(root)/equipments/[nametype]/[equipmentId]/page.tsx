'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useEffect, useState } from 'react';
import { Room } from '@/app/(root)/rooms/columns';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CreateEquipment = ({
  params,
}: {
  params: { nametype: string; equipmentId: string };
}) => {
  const FormSchema = z.object({
    room: z.string(),
    status: z.enum(['working', 'maintained', 'broken'], {
      required_error: 'You need to select a equipment status.',
    }),
    name: z.string().min(2, {
      message: 'Equipment name must be at least 2 characters.',
    }),
    nametype:
      params.equipmentId === 'new'
        ? z
            .string()
            .min(1, { message: 'Nametype must be at least 1 characters.' })
        : z.string().optional(),
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const token = useAppSelector((state: any) => state.auth.token);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      room: '',
      status: undefined,
      name: '',
      nametype: params.equipmentId === 'new' ? '' : params.nametype,
    },
  });

  const route = useRouter();
  useEffect(() => {
    const fetchRoom = async () => {
      const res = await newRequest.get('/api/v1/room', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(res.data.data);
    };

    const fetchEquipmentData = async () => {
      if (params.equipmentId !== 'new') {
        try {
          const res = await newRequest.get(
            `/api/v1/${params.nametype}/${params.equipmentId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const equipmentData = res.data.data;

          form.reset({
            room: String(equipmentData.room.id),
            status: equipmentData.status,
            name: equipmentData.name,
            nametype: params.nametype,
          });
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      }
    };

    fetchRoom();
    fetchEquipmentData();
  }, [params.equipmentId, params.nametype, token, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (params.equipmentId === 'new') {
        try {
          const response = await newRequest.post(
            `/api/v1/${data.nametype}/create`,
            {
              name: data.name,
              room_id: parseInt(data.room),
              status: data.status,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Create ${params.nametype} success`);
          route.push('/equipments');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/equipments');
        }
      } else {
        try {
          const response = await newRequest.put(
            `/api/v1/${params.nametype}/update/${params.equipmentId}`,
            {
              name: data.name,
              room_id: parseInt(data.room),
              status: data.status,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Update ${params.nametype} success`);
          route.push('/equipments');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/equipments');
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
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rooms.map((item: any, index: any) => (
                    <SelectItem key={index} value={String(item.id)}>
                      {item.room_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {params.equipmentId === 'new' && (
          <FormField
            control={form.control}
            name="nametype"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                        <RadioGroupItem value="aircondition" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Air condition
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="tandch" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Table & chair
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                      <RadioGroupItem value="working" />
                    </FormControl>
                    <FormLabel className="font-normal">Working</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="broken" />
                    </FormControl>
                    <FormLabel className="font-normal">Broken</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="maintained" />
                    </FormControl>
                    <FormLabel className="font-normal">Maintained</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name equipment</FormLabel>
              <FormControl>
                <Input placeholder="Name equipment" {...field} />
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

export default CreateEquipment;
