import Input from "@/components/forms/Input";
import Layout from "@/components/layout/Layout";
import { useAuth, useAuthDispatch } from "@/hooks/useAuth";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { headers } from "next/headers";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function RegisterPage() {
  const inputEmail = useRef<HTMLInputElement>(null);
  const inputUsername = useRef<HTMLInputElement>(null);
  const inputPassword = useRef<HTMLInputElement>(null);
  const { status } = useAuth();
  const authDispatch = useAuthDispatch();


  const router = useRouter();
  const pathName = router.pathname;

  async function register(name: string, email: string, password: string) {
    authDispatch({ type: 'START_LOADING' });
    const toastId = toast.loading('Registering...');
    axios.post('http://localhost:8000/api/auth/register', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
      name: name,
      email: email,
      password: password,
    }).then((res) => {
      authDispatch({ type: 'LOGOUT' });
      toast.remove(toastId);
      toast.success('Register successful');
      router.push('/login');
    }).catch((err) => {
      authDispatch({ type: 'LOGOUT' });
      toast.remove(toastId);
      toast.error(err.message);
    });
  } 

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = inputEmail.current?.value;
    const name = inputUsername.current?.value;
    const password = inputPassword.current?.value;
    if (email && password && name) {
      register(name, email, password);
    }
  }

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
              <Input type='text' inputEmail={inputUsername} placeholderText='Username' />
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
                    Sign Up
                  </Button>
                )}

              {/* forget password */}
              <div className='flex justify-end items-center'>
                <Link href='#' className='text-black font-primary text-base hover:underline'>Forget password?</Link>
              </div>
              {/* not a member yet? sign up */}
              <div className='flex justify-center items-center'>
                <p className='text-black font-primary text-base'>Already have an account? </p>
                <Link href='/login' className='text-primary-light font-primary text-base hover:underline mx-2'>Sign In</Link>
              </div>
          </form>
          </div>
      </div>
      </section>
    </Layout>
  )
}