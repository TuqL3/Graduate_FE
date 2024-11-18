"use client"

import { Button } from '@/components/ui/button';
import { Schedule, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useState, useEffect } from 'react';

export default function DemoPage() {
  const token = useAppSelector((state: any) => state.auth.token);
  const [data, setData] = useState<Schedule[]>([]);
  const isRefresh = useAppSelector((state: any)=>state.auth.isRefresh)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const schedule = await newRequest.get('/api/v1/schedule', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(schedule.data.data);
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
          <h2>Schedules</h2>
          <span className="opacity-40">Schedule list</span>
        </div>

        <Link href={'/schedule/new'}>
          <Button
            className="flex items-center justify-between gap-2"
            variant={'destructive'}
          >
            <Plus size={16} />  
            <span>Create schedule</span>
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
 