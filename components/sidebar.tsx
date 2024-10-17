'use client';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { BsCalendarEvent } from 'react-icons/bs';
import { GoReport } from 'react-icons/go';
import { CiUser } from 'react-icons/ci';
import { LuSchool } from 'react-icons/lu';
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Calendar', icon: <BsCalendarEvent />, href: '/calendar' },
    { name: 'Report', icon: <GoReport />, href: '/report' },
    { name: 'Rooms', icon: <LuSchool />, href: '/rooms' },
    { name: 'Users', icon: <CiUser />, href: '/users' },
  ];

  return (
    <div
      className={`flex shadow-lg h-screen flex-col transition-all duration-300 'bg-white text-gray-800' ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-2 p-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center ${
                  pathName.slice(1).includes(item.href.slice(1))
                    ? 'bg-red-400 text-white'
                    : ''
                } text-black w-full p-2 rounded-lg hover:bg-red-200 hover:no-underline`}
              >
                <span className="mr-3">{item.icon}</span>
                {!isCollapsed && (
                  <span className="flex-grow text-left">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
