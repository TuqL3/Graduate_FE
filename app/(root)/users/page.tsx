import { Button } from '@/components/ui/button';
import { User, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  return [
    {
      id: 'dsfasdf',
      userName: 'tung',
      fullName: 'TuqL3',
      role: 'giang_vien',
      email: 'admin@gmail.com',
      phone: '1234567890',
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
          <h2>Users</h2>
          <span className="opacity-40">User list</span>
        </div>

        <Link href={'/users/new'}>
          <Button
            className="flex items-center justify-between gap-2"
            variant={'destructive'}
          >
            <Plus size={16} />
            <span>Create user</span>
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
