"use client";

import { useActionState } from 'react';
import login from './action';
import { getFormDataFromState } from 'better-react-server-actions';

export default function Page() {
  const [state, action] = useActionState(login, {});

  const formData = getFormDataFromState(state);  

  return (
    <>

      <form 
        action={action} 
        className="flex flex-col gap-4"
      >
        <h1 className="text-3xl font-black">Login</h1>

        <p className="text-gray-500 text-sm italic">
          Note: the username is "admin@example.com" and the password is "password".
        </p>

        <span className="text-red-500">
          {state.errors?.formErrors}
        </span>

        <div className="flex flex-col space-y-1">
          <label htmlFor="email">Email:</label>
          <input 
            id="email" 
            name="email" 
            className="border p-1" 
            defaultValue={formData.get('email') ?? undefined}
          />
          <span className="text-red-500 text-sm">
            {state.errors?.fieldErrors.email}
          </span>
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="password">Password:</label>
          <input 
            id="password" 
            name="password" 
            className="border p-1" 
            type="password"
            defaultValue={formData.get('password') ?? undefined}
          />
          <span className="text-red-500 text-sm">
            {state.errors?.fieldErrors.password}
          </span>
        </div>

        <button className="bg-gray-300 p-1">
          Login
        </button>

      </form>
    </>
  )
}
