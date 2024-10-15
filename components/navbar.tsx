'use client';
import React, { useState } from 'react';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };

  return (
    <nav className="bg-[rgb(235,30,35)] p-4 shadow-lg">
      <div className="mx-auto flex justify-between items-center">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          aria-label="Go to homepage"
        >
          <img src="/logo.png" className="h-[40px] w-[40px]" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Lab center
          </span>
        </a>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleAuth}
                className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                aria-label="Open user menu"
              >
                <FaUser className="mr-2" />
                My Account
              </button>
              {isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    onClick={toggleAuth}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          ) : (
            <>
              <a
                href="#"
                onClick={toggleAuth}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Login
              </a>
              <a
                href="#"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Sign Up
              </a>
            </>
          )}
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-300 hover:text-white focus:outline-none focus:text-white"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            Services
          </a>
          <a
            href="#"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
          >
            Contact
          </a>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          {isAuthenticated ? (
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <FaUser className="h-10 w-10 rounded-full text-gray-300" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  John Doe
                </div>
                <div className="text-sm font-medium leading-none text-gray-400">
                  john@example.com
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <a
                href="#"
                onClick={toggleAuth}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
              >
                Login
              </a>
              <a
                href="#"
                className="bg-blue-500 hover:bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
