import axios from 'axios';
import Layout from '@/components/layout/Layout';
import { Button, Spinner } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth, useAuthDispatch } from '@/hooks/useAuth';

import { USER_STORAGE_KEY } from '@/storageKey';
import { ResponseLogin } from '@/types/account';
import Input from '@/components/forms/Input';
import { useForm } from 'react-hook-form';
import { headers } from 'next/headers';

export default function LoginPage() {


  const inputEmail = useRef<HTMLInputElement>(null);
  const inputPassword = useRef<HTMLInputElement>(null);
  const { status } = useAuth();
  const authDispatch = useAuthDispatch();

  const router = useRouter();

  async function login(email: string, password: string) {
    authDispatch({ type: 'START_LOADING' });
    const toastId = toast.loading('Logging in...');
    axios.post('http://localhost:8000/api/auth/login', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
      email: email,
      password: password,
    }).then((res) => {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
      console.log("ACCESS_TOKEN", res.data.data.token);
      console.log("USER_DATA", res.data.data.user);
      authDispatch({
        type: 'LOGIN', payload: {
          access_token: res.data.data.token,
          user: res.data.data.user,
        }
      });
      authDispatch({ type: 'SAVE_AUTH' });
      toast.remove(toastId);
      toast.success('Login successful');
      router.push('/dashboard');
    }).catch((err) => { 
      authDispatch({ type: 'LOGOUT' });
      toast.remove(toastId);
      toast.error(err.message);
    });
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = inputEmail.current?.value;
    const password = inputPassword.current?.value;
    if (email && password) {
      login(email, password);
    }
  };

  
  return (
    <Layout>
      <Toaster
        containerStyle={{
          top: 84,
          left: 20,
          bottom: 20,
          right: 20,
        }}
      />
      <section className="flex h-full w-full flex-col gap-4 overflow-auto rounded-lg dark:bg-gray-900 ">
      <div className='flex min-h-[80vh]  flex-col items-center justify-center'>
          <div className='w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6 md:min-w-[50vw] md:p-8 lg:min-w-[30vw] xl:min-w-[34vw]'>
          <form className='space-y-6  flex flex-col justify-center items-center px-5' onSubmit={handleSubmit} >
              {/* add container to save image */}
              <div className='flex justify-center items-start'>
                {/* <img src='/images/logo-lecsens.jpeg' className='h-10 ' alt='logo' /> */}
                <p className='tex-center text-primary-light text-lg font-bold'>ChatApp</p>
              </div>
              <Input type='text' inputEmail={inputEmail} placeholderText='Email' />
              <Input type='password'  inputEmail={inputPassword} placeholderText='Password' />
              {
                status === 'loading' ? (
                  <Button type = "submit"  disabled className = "w-full text-white bg-primary-light py-1 cursor-pointer hover:bg-primary-medium" >
                    <Spinner aria-label='Spinner button example' />
                    <span className='pl-3'>Loading...</span>
                  </Button>
                ): (
                  <Button type = "submit" className = "w-full text-white bg-primary-light py-1 cursor-pointer hover:bg-primary-medium" >
                    Sign In
                  </Button>
                )}
              <div className="w-full flex  justify-stretch items-center">
                <div className="border-t border-secondary-slate flex-grow"></div>
                <p className="text-secondary-slate text-base font-medium">Connect with</p>
                <div className="border-t border-secondary-slate flex-grow"></div>
              </div>
              <Button type="submit" disabled className="w-full text-white bg-secondary-red py-1 cursor-pointer hover:bg-secondary-redDark" >
                {/* add image */}
                <img src='/images/google.png' className='h-4 ' alt='logo' />
              </Button>
              {/* forget password */}
              <div className='flex justify-end items-center'>
                <Link href='#' className='text-black font-primary text-base hover:underline'>Forget password?</Link>
              </div>
              {/* not a member yet? sign up */}
              <div className='flex justify-center items-center'>
                <p className='text-black font-primary text-base'>Not a member yet? </p>
                <Link href='/register' className='text-primary-light font-primary text-base hover:underline mx-2'>Sign Up</Link>
              </div>
          </form>
          </div>
      </div>
      </section>
    </Layout>
  );
}