import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/layout/Layout";
import Typography from "@/components/typography/Typography";
import { Button } from "flowbite-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout>
    <section className='flex h-full w-full flex-col gap-4 overflow-auto rounded-lg'>
      <div className='relative px-6 lg:px-8'>
        <div className='mx-auto max-w-6xl pb-32 pt-16 2xl:pb-40 2xl:pt-36'>
          <div className="flex md:flex-row flex-col  gap-4 justify-center items-stretch">
            <div className="flex md:w-[60%] w-full flex-col gap-4 justify-center items-start ">
              <Typography variant='h1' className='text-center !text-black'>Chat Application Assistant</Typography>
                <p className="font-primary text-secondary-slateDark text-2xl font-normal">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam laboriosam libero corrupti laborum quos quis, placeat dolore id perspiciatis. Ipsum modi, repudiandae doloremque ratione iure officiis voluptates id. Expedita quia voluptas, dicta id odio incidunt deserunt quam magnam non sequi iusto impedit dolore ea a, nesciunt voluptatibus dolorem dolor asperiores magni dolores velit, accusantium repellendus quos. Fugit possimus asperiores sit nobis quo exercitationem iusto nulla saepe, repellendus amet, aliquid eaque ipsum quisquam tempore cumque provident a est tempora ducimus ut! Ratione, nemo ex laborum quaerat esse optio? Error consequuntur est ullam amet delectus similique ad ut? Labore in asperiores corporis?
                </p>
              <Button className='px-5 py-2 !bg-primary-light hover:!bg-primary-medium cursor-pointer'>
                <Link href='/login' className="text-xl">
                    Get Started
                </Link>
              </Button>
            </div>
            {/* add image container for hompage*/}
            <div className="flex-1 md:order-last order-first bg-gray-200 flex items-center">
              <img src="/images/chatapp.jpg" alt="Gambar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>  
  </Layout>
  );
}
