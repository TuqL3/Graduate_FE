'use client';

import { Button } from '@/components/ui/button';
import { Report, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useState, useEffect } from 'react';

export default function DemoPage() {
  const token = useAppSelector((state: any) => state.auth.token);
  const [data, setData] = useState<Report[]>([]);
  console.log(data);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const report = await newRequest.get('/api/v1/report', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(report.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, [token]);


  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h2>Reports</h2>
          <span className="opacity-40">Report list</span>
        </div>

        <Link href={'/report/new'}>
          <Button
            className="flex items-center justify-between gap-2"
            variant={'destructive'}
          >
            <Plus size={16} />
            <span>Create report</span>
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
