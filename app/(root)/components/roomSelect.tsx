'use client';

import { usePathname, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { newRequest } from '@/lib/newRequest';
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';

const FormSchema = z.object({
  room: z.string({
    required_error: 'Please select a room to display.',
  }),
});

interface ISelectRoom {
  setEvents: (data: any) => void;
}

const SelectRoom: React.FC<ISelectRoom> = ({ setEvents }) => {
  const token = useAppSelector((state: any) => state.auth.token);
  
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      room: "all"
    }
  });

  const pathName = usePathname()

  console.log(rooms);
  

  const transformToEvents = (apiData: any) => {
    return apiData.data.map((schedule: any) => ({
      id: schedule.id,
      title: schedule.title,
      description: schedule.description,
      location: schedule.room.id,
      participants: schedule.user.id,
      start: new Date(schedule.start_time),
      end: new Date(schedule.end_time),
    }));
  };

  async function onSubmit(roomId: string) {
    try {
      router.push(roomId === 'all' ? `${pathName}` : `?roomId=${roomId}`);

      const url = roomId === 'all' ? '/api/v1/schedule' : `/api/v1/schedule?roomId=${roomId}`;
      const res = await newRequest.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const events = transformToEvents(res.data);
      setEvents(events);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await newRequest.get('api/v1/room',{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRooms(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoom();
  }, []);

  return (
    <Form {...form}>
      <form className="w-full space-y-6">
        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);  
                  onSubmit(value);       
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {rooms.map((room: any, index: any) => (
                    <SelectItem key={index} value={`${room.id}`}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SelectRoom;
