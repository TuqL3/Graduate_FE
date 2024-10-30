"use client"

import { Button } from '@/components/ui/button';
import { Category, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useState, useEffect } from 'react';

export default function DemoPage() {
  const token = useAppSelector((state: any) => state.auth.token);
  const [data, setData] = useState<Category[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const category = await newRequest.get('/api/v1/category', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(category.data.data);
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
          <h2>Categories</h2>
          <span className="opacity-40">Category list</span>
        </div>

        <Link href={'/category/new'}>
          <Button
            className="flex items-center justify-between gap-2"
            variant={'destructive'}
          >
            <Plus size={16} />  
            <span>Create category</span>
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
 