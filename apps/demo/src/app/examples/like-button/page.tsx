"use client";
 
import { useActionState } from 'react';
import { toggleLike } from './action';
 
export default function Page() {
  const [state, action] = useActionState(toggleLike, {});
 
  return (
    <form 
      action={action} 
      className="flex flex-col gap-4"
    >
      <h1 className="text-3xl font-black">Like Button</h1>

      <p className="italic">Imagin this is a like button you fine on a social media platform.</p>
 
      <button className="bg-gray-300 p-1">
        {state.likeId ? 'Unlike' : 'Like'}
      </button>
    </form>
  )
}
