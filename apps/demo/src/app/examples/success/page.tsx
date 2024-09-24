'use client';

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-bold text-2xl">
        Your action was successful!
      </h1>
      <button onClick={() => router.back()} className="bg-gray-300 p-1">
        Go back
      </button>
    </main>
  )  
}
