import { Dropdown, Navbar as FlowbiteNavbar } from 'flowbite-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
  HiCog,
  HiLogout,
  HiMenuAlt1, 
  HiUpload,
  HiViewGrid
} from 'react-icons/hi';

import clsxm from '@/lib/clsxm';
import { useAuth, useAuthDispatch } from '@/hooks/useAuth';
import Link from 'next/link';
import { useLayout, useLayoutDispatch } from '@/hooks/useLayout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { USER_STORAGE_KEY } from '@/storageKey';

export default function Navbar() {
  const { user, status, access_token } = useAuth();
  const dispatchAuth = useAuthDispatch();
  const { isSidebarCollapsed, isSidebarAvailable, isFooterAvailable } = useLayout();
  const dispatchLayout = useLayoutDispatch();

  const router = useRouter();

  const logout = async () => {
    console.log("BEARER", access_token);
    const toastId = toast.loading('Logging out...');
  
    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/logout',
        {}, // Body kosong jika tidak diperlukan
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
  
      localStorage.removeItem(USER_STORAGE_KEY);
      toast.success('Logged out successfully');
      dispatchAuth({ type: 'LOGOUT' });
      router.push('/login');
    } catch (error) {
      toast.error('An error occurred');
      console.log(error);
    } finally {
      toast.remove(toastId);
    }
  };
  
  const handleLogout = () => {
    if (access_token !== '') {
      logout();
    }
  }

  // useEffect(() => {
  //   console.log(router.pathname);
  // }, [])

  return (
    <FlowbiteNavbar
      fluid={true}
      rounded={true}
      className={clsxm(' z-10 gap-4 drop-shadow bg-white')}
    >
      <div className='flex flex-row justify-between w-full mx-20 my-2'>
        <FlowbiteNavbar.Brand href='/'>
          {
            isSidebarAvailable && (
              <HiMenuAlt1
                className='mr-6 h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-400'
                onClick={() => 
                  dispatchLayout({
                    type: 'SET_ISSIDEBARCOLLAPSED',
                    payload: !isSidebarCollapsed,
                  })
                }
              >
              </HiMenuAlt1>
            )
          }
          <img
            src='/images/chatapp.jpg'
            className='inline-flex h-6 sm:h-12'
            alt='lecsens logo'
          />
        </FlowbiteNavbar.Brand>
        <div className='flex flex-row gap-10 items-center'>
          <Link
            href={'/'}
            onClick={(e) => {
              e.preventDefault();
              router.pathname = '/';
              router.push(router);
            }}
            className={clsxm(
              'font-primary text-lg hover:cursor-pointer hover:text-primary-medium',
              
            router.pathname === '/' && 'text-primary-light',
          )}>
            Home
          </Link>
          <Link
            href={'/dashboard'}
            onClick={(e) => {
              e.preventDefault();
              router.pathname = '/dashboard';
              router.push(router);
            }}
            className={clsxm(
              'font-primary text-lg hover:cursor-pointer hover:text-primary-medium',
              
            router.pathname === '/dashboard' && 'text-primary-light',
          )}>
            Dashboard
          </Link>

        </div>
        <div className='flex flex-row gap-10 items '>
          {
            status == 'unauthenticated' ? (
              <>
                <Link
              href={'/login'}
              onClick={(e) => {
                e.preventDefault();
                router.pathname = '/login';
                router.push(router);
              }}
              className={clsxm(
                'font-primary flex justify-center items-center text-lg hover:cursor-pointer hover:bg-slate-100 px-4 py-1 rounded-md',
              )}
            >
              Login
            </Link>
            <Link
              href={'/register'}
              onClick={(e) => {
                e.preventDefault();
                router.pathname = '/register';
                router.push(router);
              }}
              className={clsxm(
                'font-primary inline-flex my-1 justify-center items-center  text-lg hover:cursor-pointer text-white bg-primary-light hover:bg-primary-medium  px-8 rounded-md',
                router.pathname === '/register' && 'text-white bg-primary-light',
              )}
            >
              SignUp
            </Link>
              </>
              
            ): (
              <button
              onClick={handleLogout}
              className={clsxm(
                'font-primary inline-flex my-1 justify-center items-center  text-lg hover:cursor-pointer text-white bg-primary-light hover:bg-primary-medium  px-8 rounded-md',
                router.pathname === '/register' && 'text-white bg-primary-light',
              )}
            >
              Logout
            </button>
            )
          }
         
        </div>
      </div>
    </FlowbiteNavbar>
  );  
}