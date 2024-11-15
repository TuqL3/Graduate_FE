"use client"

import { Button } from '@/components/ui/button';
import { Permission, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useState, useEffect } from 'react';

export default function DemoPage() {
  const token = useAppSelector((state: any) => state.auth.token);
  const isRefresh = useAppSelector((state: any)=>state.auth.isRefresh)
  const [data, setData] = useState<Permission[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const permission = await newRequest.get('/api/v1/permission', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(permission.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, [token, isRefresh]);

  console.log(data);
  

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h2>Permissions</h2>
          <span className="opacity-40">Permission list</span>
        </div>

        <Link href={'/permission/new'}>
          <Button
            className="flex items-center justify-between gap-2"
            variant={'destructive'}
          >
            <Plus size={16} />  
            <span>Create permission</span>
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
 