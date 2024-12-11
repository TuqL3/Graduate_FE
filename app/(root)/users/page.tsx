'use client';

import { Button } from '@/components/ui/button';
import { User, columns } from './columns';
import { DataTable } from './data-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import { useEffect, useState } from 'react';

export default function DemoPage() {
  const token = useAppSelector((state: any) => state.auth.token);
  const isRefresh = useAppSelector((state: any) => state.auth.isRefresh);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await newRequest.get('/api/v1/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, [token, isRefresh]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await newRequest.post('/api/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('File imported successfully: ' + response.data.message);
    } catch (error) {
      setMessage('Failed to import file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Users</h2>
          <span className="text-gray-500">User list</span>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Link href={'/users/new'}>
            <Button className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600">
              <Plus size={16} />
              <span>Create User</span>
            </Button>
          </Link>
        </div>
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.includes('successfully') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}

      <div className="bg-white p-6 rounded-md shadow-md">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
