'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import toast from 'react-hot-toast';
export type Equipment = {
  name_type: string;
  id: string;
  room: Room;
  name: string;
  status: 'working' | 'broken' | 'maintained';
};

interface Room {
  id: string;
  room_name: string;
}

export const columns: ColumnDef<Equipment>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorFn: (row) => row.room.room_name,
    accessorKey: 'room',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Room
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Equipment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const id = row.getValue('id');
      const name_type = row.original?.name_type;
      const route = useRouter();
      const token = useAppSelector((state: any) => state.auth.token);
      const handleDelete = async () => {
        await newRequest.delete(`/api/v1/${name_type}/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Delete equipment success');
        route.refresh();
      };

      // const handleUpdate = async () => {
      //   await newRequest.post(`/api/v1/${name_type}/update/${id}`, {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });
      // };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link
                href={`/equipments/${name_type}/${id}`}
                className="flex items-center justify-between text-black gap-2 hover:no-underline"
              >
                <Pencil />
                <span>Update</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete()}
              className="text-red-500"
            >
              <Trash2 />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
