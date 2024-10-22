import { Button } from '@/components/ui/button';
import { Room, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getData(): Promise<Room[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      roomName: 'Dieu hoa',
      capacity: 'Room1',
      status: 'in_use',
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
 