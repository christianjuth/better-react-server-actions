"use client";
 
import { useActionState } from 'react';
import { incrementCounter } from './action';
 
export default function Page() {
  const [state, action] = useActionState(incrementCounter, {
    count: 0,
  });
 
  return (
    <form 
      action={action} 
      className="flex flex-col gap-4"
    >
      <h1 className="text-3xl font-black">Increment Counter</h1>

      <span>Count: {state.count}</span>
      <button className="bg-gray-300 p-1">
        Increment
      </button>
    </form>
  )
}
