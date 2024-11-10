'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(2, {
    message: 'Password must be at least 2 characters.',
  }),
});

export function LoginForm() {
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
    const res = await newRequest.post('/api/v1/user/login', {
      username: values.username,
      password: values.password,
    });
    console.log(res.data);

    dispatch(
      login({
        token: res.data.data.token,
        user: res.data.data.user,
      }),
    );

    navigation.push('/');
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public your username.
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>This is your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button
            className="bg-red-500 text-white hover:bg-white hover:text-red-500"
            type="submit"
          >
            Submit
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-white hover:text-red-500"
            type="submit"
          >
            Forgot password
          </Button>
        </div>
      </form>
    </Form>
  );
}
