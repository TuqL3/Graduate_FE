'use client';

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/footer';
import './css.css';
import Header from '@/components/Header';
import Sidebar1 from '@/components/Sidebar/index';
import { useAppSelector } from '@/lib/redux/hooks';
import { useRouter } from 'next/navigation';
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useRouter();
  const user = useAppSelector((state: any) => state.auth.user);
  if (!user) {
    navigate.push('/login');
  }

  return (
    <div>
      <div className="flex h-screen overflow-hidden">
        <Sidebar1 />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header />
          <main>
            <div className="mx-auto p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
