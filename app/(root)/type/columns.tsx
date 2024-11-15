'use client';

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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { newRequest } from '@/lib/newRequest';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import toast from 'react-hot-toast';
import { refresh } from '@/lib/redux/features/auth/authSlice';
export type Type = {
  id: string;
  name: string;
};

export const columns: ColumnDef<Type>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const id = row.getValue('id');
      const route = useRouter();
      const token = useAppSelector((state: any) => state.auth.token);
      const dispatch = useAppDispatch();

      const handleDelete = async () => {
        await newRequest.delete(`/api/v1/equipmenttype/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Delete equipmenttype success');
        dispatch(refresh())

      };
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
                className="flex items-center justify-between text-black gap-2 hover:no-underline"
                href={`/type/${id}`}
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
