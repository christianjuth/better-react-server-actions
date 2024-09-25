"use server";
 
import { createAction } from 'better-react-server-actions';
import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { redirect } from 'next/navigation';
 
const EMAIL = 'admin@example.com';
const PASSWORD = 'password';
 
export const login = createAction({
  formDataSchema: zfd.formData({
    email: z.string().email(),
    password: zfd.text(),
  }),
  requestHandler: async (prevState, { email, password }) => {
    if (email !== EMAIL || password !== PASSWORD) {
      throw new Error('Invalid email or password');
    }
 
    redirect('/examples/success');
  }
});
