import { Button } from '@/components/ui/button';
import { Equipment, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getData(): Promise<Equipment[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      name: 'Dieu hoa',
      room: 'Room1',
      status: 'working',
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
 