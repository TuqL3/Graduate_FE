import React from 'react';
import Link from 'next/link';
import SidebarDropdown from '@/components/Sidebar/SidebarDropdown';
import { usePathname } from 'next/navigation';

const SidebarItem = ({ item }: any) => {
  const pathName = usePathname();
  const isActive = pathName === item.route;

  return (
    <>
      <div className={`px-6 ${isActive ? 'bg-gray-300' : ''}`}>
        <Link
          href={item.route}
          className="relative flex items-center px-7 py-2 gap-2 text-gray-600 no-underline"
        >
          {item.icon}
          <span>{item.label}</span>

          {/* Badge Message */}
          {item.message && (
            <span className="absolute right-[46px] top-1/2 -translate-y-1/2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-medium text-white">
              {item.message}
            </span>
          )}

          {/* Pro Badge */}
          {item.pro && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-white">
              Pro
            </span>
          )}

          {/* Dropdown Icon */}
          {item.children && (
            <svg
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform duration-300 ${
                isActive ? 'rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </Link>

        {/* Dropdown Children */}
        {item.children && (
          <div
            className={`transition-max-height duration-300 overflow-hidden ${
              isActive ? 'max-h-screen' : 'max-h-0'
            }`}
          >
            <SidebarDropdown item={item.children} />
          </div>
        )}
      </div>
    </>
  );
};

export default SidebarItem;

