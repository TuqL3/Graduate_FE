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

const CreateEquipment = ({ params }: { params: { equipmentId: string } }) => {
  const FormSchema = z.object({
    room: z.string().min(1, {
      message: 'Room must be at least 2 characters.',
    }),
    status: z.string(),
    name: z.string().min(1, {
      message: 'Equipment name must be at least 2 characters.',
    }),
    type: z.string().min(1, {
      message: 'Equipment name must be at least 2 characters.',
    }),
  });

  const [rooms, setRooms] = useState([]);
  const [types, setTypes] = useState([]);
  const token = useAppSelector((state: any) => state.auth.token);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      room: undefined,
      status: '',
      name: '',
      type: undefined,
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

    const fetchType = async () => {
      const res = await newRequest.get('/api/v1/equipmenttype', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTypes(res.data.data);
    };

    const fetchEquipmentData = async () => {
      if (params.equipmentId !== 'new') {
        try {
          const res = await newRequest.get(
            `/api/v1/equipment/${params.equipmentId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const equipmentData = res.data.data;
          console.log(equipmentData);

          form.reset({
            room: String(equipmentData.room_id),
            status: equipmentData.status,
            name: equipmentData.name,
            type: equipmentData.equipment_type_id
              ? String(equipmentData.equipment_type_id)
              : '',
          });
        } catch (error) {
          console.error('Error fetching equipment:', error);
        }
      }
    };

    fetchRoom();
    fetchEquipmentData();
    fetchType();
  }, [params.equipmentId, token, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (params.equipmentId === 'new') {
        try {
          const response = await newRequest.post(
            `/api/v1/equipment/create`,
            {
              name: data.name,
              room_id: parseInt(data.room),
              status: data.status,
              equipment_type_id: parseInt(data.type),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Create equipment success`);
          route.push('/equipments');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/equipments');
        }
      } else {
        try {
          const response = await newRequest.put(
            `/api/v1/equipment/update/${params.equipmentId}`,
            {
              name: data.name,
              room_id: parseInt(data.room),
              status: data.status,
              equipment_type_id: parseInt(data.type),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          toast.success(`Update equipment success`);
          route.push('/equipments');
        } catch (error) {
          toast.error('Something went wrong');
          route.push('/equipments');
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {types.map((item: any, index: any) => (
                    <SelectItem key={index} value={String(item.id)}>
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
