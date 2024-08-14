import * as React from "react";

import clsxm from "@/lib/clsxm";
// import Navbar from "./Navbar";

import LayoutProvider from "../context/LayoutProvider";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode; }) {



  return (
    <LayoutProvider>
      <div className='flex h-screen w-full flex-col overflow-hidden'>
        {/* <Navbar /> */}
        <Navbar />
        <main className={clsxm("flex", "flex-1", "overflow-y-auto", "bg-white")}>
          {children}
        </main>
      </div>
    </LayoutProvider>
  );
}