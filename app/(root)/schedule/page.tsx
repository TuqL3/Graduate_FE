'use client';

import { Button } from '@/components/ui/button';
import { Schedule, columns } from './columns';
import { DataTable } from './data-table';
import { Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DemoPage() {
  const token = useAppSelector((state: any) => state.auth.token);
  const [data, setData] = useState<Schedule[]>([]);
  const isRefresh = useAppSelector((state: any) => state.auth.isRefresh);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schedule = await newRequest.get('/api/v1/schedule', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(schedule.data.data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchData();
  }, [token, isRefresh]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await newRequest.post('/api/v1/schedule/import', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file.');
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h2>Schedules</h2>
          <span className="opacity-40">Schedule list</span>
        </div>

        <div className="flex items-center gap-4">
          {/* File upload input */}
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="block w-full max-w-[200px] text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
          <Button
            onClick={handleUpload}
            className="flex items-center gap-2"
            variant={'default'}
          >
            <Upload size={16} />
            <span>Upload</span>
          </Button>

          {/* Create schedule button */}
          <Link href={'/schedule/new'}>
            <Button
              className="flex items-center justify-between gap-2"
              variant={'destructive'}
            >
              <Plus size={16} />
              <span>Create schedule</span>
            </Button>
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
