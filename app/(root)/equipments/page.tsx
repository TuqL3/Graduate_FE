'use client';
import { Button } from '@/components/ui/button';
import { Equipment, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useState, useEffect } from 'react';
import { User } from '../users/columns';

export default function DemoPage() {
  const token = useAppSelector((state: any) => state.auth.token);
  const isRefresh = useAppSelector((state: any)=>state.auth.isRefresh)
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipment = await newRequest.get('/api/v1/equipment', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(equipment.data.data);
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
          <h2>Equipments</h2>
          <span className="opacity-40">Equipment list</span>
        </div>

        <Link href={'/equipments/new'}>
          <Button
            className="flex items-center justify-between gap-2"
            variant={'destructive'}
          >
            <Plus size={16} />
            <span>Create equipment</span>
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
