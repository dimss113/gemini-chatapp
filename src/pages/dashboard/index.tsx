import Assistants from "@/components/contents/Assistants";
import Layout from "@/components/layout/Layout";
import { Toaster } from "react-hot-toast";

export default function AssistantsPage() {
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
          <Assistants />
          </div>
        </section>
      </Layout>
  );
}