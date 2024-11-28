'use client';

import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/footer';
import './css.css';
import Header from '@/components/Header';
import Sidebar1 from '@/components/Sidebar/index';
import { useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
import { WebSocketProvider } from '@/utils/websocketContext';
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useRouter();
  const user = useAppSelector((state: any) => state.auth.user);
  let role: string;

  if (user) {
    role = user.roles[0].role_name;
  }

  useEffect(() => {
    if (!user) {
      navigate.push('/login');
    } else if (role == 'giangvien') {
      navigate.push('calendar');
    }
  }, [user, navigate]);
  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="flex h-screen overflow-hidden">
        <Sidebar1 />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header />
          <main>
            <div className="mx-auto p-4 md:p-6 2xl:p-10">
              <WebSocketProvider userId={user.id}>{children}</WebSocketProvider>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
