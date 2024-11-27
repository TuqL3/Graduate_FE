'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SidebarItem from '@/components/Sidebar/SidebarItem';
import { useAppSelector } from '@/lib/redux/hooks';
import { Bug, CalendarClock, CalendarRange, Contact, FileType, Hammer, Home, MessageSquareMore, School, ShieldCheck, UserRoundCog } from 'lucide-react';

const menuGroups = [
  {
    menuItems: [
      {
        icon: (
          <Home/>
        ),
        label: 'Dashboard',
        route: '/',
        role: ["admin","trucban","giamdoc"]
      },
      {
        icon: (
          <CalendarRange/>
        ),
        label: 'Calendar',
        route: '/calendar',
        role: ["admin","trucban","giamdoc","giangvien"]
      },
      {
        icon: (
          <CalendarClock/>
        ),
        label: 'Schedule',
        route: '/schedule',
        role: ["admin","trucban","giamdoc"]
      },
      {
        icon: (
          <Contact/>
        ),
        label: 'User',
        route: '/users',
        role: ["admin","giamdoc"]
      },
      {
        icon: (
          <FileType/>
        ),
        label: 'Type',
        route: '/type',
        role: ["admin"]
      },
      {
        icon: (
          <ShieldCheck/>
        ),
        label: 'Permission',
        route: '/permission',
        role: ["admin"]
      },
      {
        icon: (
          <UserRoundCog/>
        ),
        label: 'Role',
        route: '/role',
        role: ["admin"]
      },
      {
        icon: (
          <Hammer/> 
        ),
        label: 'Equipment',
        route: '/equipments',
        role: ["admin","trucban","giamdoc"]
      },
      {
        icon: (
          <Bug/>
        ),
        label: 'Report',
        route: '/report',
        role: ["admin","trucban","giamdoc","giangvien"]
      },
      {
        icon: (
          <School/>
        ),
        label: 'Room',
        route: '/rooms',
        role: ["admin","trucban","giamdoc"]
      },
      {
        icon: (
          <MessageSquareMore/>
        ),
        label: 'Conversation',
        route: '/conversation',
        role: ["admin","trucban","giamdoc","giangvien"]
      },
    ],
  },
];

const Sidebar1 = () => {  
  const user = useAppSelector((state: any) => state.auth.user);
  const userRole = user.roles[0].role_name.toLowerCase();

  const filteredMenuGroups = menuGroups.map(group => ({
    ...group,
    menuItems: group.menuItems.filter(item => 
      item.role.map(r => r.toLowerCase()).includes(userRole)
    )
  }));
  
  return (
    <div>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          '-translate-x-full'
        }`}
      >
        <div className="z-10 flex items-center justify-center gap-2 px-6 py-3 md:px-5 2xl:px-10">
          <Link href="/">
            <Image
              width={40}
              height={40}
              src={'/logo.png'}
              alt="Logo"
              priority
              className="dark:hidden"
              style={{ width: 'auto', height: 'auto' }}
            />
            <Image
              width={40}
              height={40}
              src={'/logo.png'}
              alt="Logo"
              priority
              className="hidden dark:block"
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-1">
            {filteredMenuGroups.map((group: any, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className={`mb-6 flex flex-col gap-2`}>
                  {group.menuItems.map((menuItem: any, menuIndex: any) => (
                    <div key={menuIndex}>
                      <SidebarItem key={menuIndex} item={menuItem} />
                    </div>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar1;