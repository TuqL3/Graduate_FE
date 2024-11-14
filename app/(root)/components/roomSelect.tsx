'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { newRequest } from '@/lib/newRequest';
import { useState, useEffect } from 'react';

const FormSchema = z.object({
  room: z.string({
    required_error: 'Please select a room to display.',
  }),
});

export function SelectRoom() {
  const [rooms, setRooms] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {}

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await newRequest.get('api/v1/room');
        setRooms(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoom();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rooms.map((room: any, index: any) => {
                    return (
                      <SelectItem key={index} value={`${room.id}`}>
                        {room.name}
                      </SelectItem>
                    );
                  })}
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
}
