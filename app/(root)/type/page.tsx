"use client"

import { Button } from '@/components/ui/button';
import { Type, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useState, useEffect } from 'react';

export default function DemoPage() {
  const token = useAppSelector((state: any) => state.auth.token);
  const [data, setData] = useState<Type[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipmenttype = await newRequest.get('/api/v1/equipmenttype', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(equipmenttype.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, [token]);

  console.log(data);
  

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h2>Types</h2>
          <span className="opacity-40">Type list</span>
        </div>

        <Link href={'/type/new'}>
          <Button
            className="flex items-center justify-between gap-2"
            variant={'destructive'}
          >
            <Plus size={16} />  
            <span>Create type</span>
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
 