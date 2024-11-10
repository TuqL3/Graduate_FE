import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginForm } from './components/formLogin';

export default function Login() {
  return (
    <div className="flex h-screen justify-center items-center">
      <div className='border 1px divide-solid p-20 rounded'>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className='text-red-500'>Login</CardTitle>
            <CardDescription className='text-red-400'>PTIT practical laboratory center</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
