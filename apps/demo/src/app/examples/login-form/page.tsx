"use client";
 
import { useActionState } from 'react';
import { login } from './action';
import { getPreviousFormData } from 'better-react-server-actions';
 
export default function Page() {
  const [state, action] = useActionState(login, {});
 
  const formData = getPreviousFormData(state);  
 
  const formErrors = state.errors?.formErrors;
 
  return (
    <form 
      action={action} 
      className="flex flex-col gap-4"
    >
      <h1 className="text-3xl font-black">Login</h1>

      <p className="italic">The email is admin@example.com and the password is password.</p>
 
      {state.errors?.actionErrors && (
        <span className="text-red-500">
          {state.errors.actionErrors.join(', ')}
        </span>
      )}
 
      <div className="flex flex-col space-y-1">
        <label htmlFor="email">Email:</label>
        <input 
          id="email" 
          name="email" 
          className="border p-1" 
          defaultValue={formData.get('email') ?? undefined}
        />
        {formErrors?.email && (
          <span className="text-red-500 text-sm">
            {formErrors.email.join(', ')}
          </span>
        )}
      </div>
 
      <div className="flex flex-col space-y-1">
        <label htmlFor="password">Password:</label>
        <input 
          id="password" 
          name="password" 
          type="password"
          className="border p-1" 
          defaultValue={formData.get('password') ?? undefined}
        />
        {formErrors?.password && (
          <span className="text-red-500 text-sm">
            {formErrors.password.join(', ')}
          </span>
        )}
      </div>
 
      <button className="bg-gray-300 p-1">
        Login
      </button>
 
    </form>
  )
}
