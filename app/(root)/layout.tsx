import Sidebar from '@/components/sidebar';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from '@/components/navbar';
import Footer from '@/components/footer';
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="block w-full h-full min-h-[80px]">
      <div className="fixed top-0 right-0 left-0">
        <NavigationBar />
      </div>

      <div className="flex mt-[76px]">
        <Sidebar />
        <div className="container m-0 p-4">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
