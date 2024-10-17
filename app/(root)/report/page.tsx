import { Button } from '@/components/ui/button';
import { Report, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getData(): Promise<Report[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      name: 'Dieu hoa',
      room: 'Room1',
      status: 'pending',
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h2>Reports</h2>/
          <span className="opacity-40">Report list</span>
        </div>

        <Link href={'/report/create'}>
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
