"use client"

import * as React from 'react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { newRequest } from '@/lib/newRequest';
import { useAppDispatch } from '@/lib/redux/hooks';
import { login } from '@/lib/redux/features/auth/authSlice';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await newRequest.post('/api/v1/user/login', {
        username: values.username,
        password: values.password,
      });

      dispatch(
        login({
          token: res.data.data.token,
          user: res.data.data.user,
          isRefresh: false
        })
      );
        
      navigation.push('/');
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: 'Invalid username or password',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-red-600 flex items-center justify-center gap-2">
            <Lock className="w-8 h-8" />
            Login
          </CardTitle>
          <CardDescription className="text-gray-500">
            PTIT Practical Laboratory Center
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-5 h-5 text-red-500" />
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Enter your username" 
                          {...field} 
                          className="pl-10 border-red-300 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Enter your registered username
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-red-500" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={isPasswordVisible ? 'text' : 'password'}
                          placeholder="Enter your password" 
                          {...field} 
                          className="pl-10 pr-10 border-red-300 focus:border-red-500 focus:ring-red-500"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                        >
                          {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Enter your secure password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className="text-red-500 text-sm text-center">
                  {form.formState.errors.root.message}
                </div>
              )}
              <div className="flex justify-between gap-4">
                <Button
                  type="submit"
                  className="w-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
                
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}