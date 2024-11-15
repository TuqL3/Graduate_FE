"use client"

import { Button } from '@/components/ui/button';
import { Room, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useState, useEffect } from 'react';

export default function DemoPage() {
  const token = useAppSelector((state: any) => state.auth.token);
  const [data, setData] = useState<Room[]>([]);
  const isRefresh = useAppSelector((state: any)=>state.auth.isRefresh)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const room = await newRequest.get('/api/v1/room', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(room.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, [token, isRefresh]);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h2>Rooms</h2>
          <span className="opacity-40">Room list</span>
        </div>

        <Link href={'/rooms/new'}>
          <Button
            className="flex items-center justify-between gap-2"
            variant={'destructive'}
          >
            <Plus size={16} />  
            <span>Create room</span>
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
 