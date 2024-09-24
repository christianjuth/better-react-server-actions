"use server";

import { createFormAction } from 'better-react-server-actions';
import * as zdf from 'zod-form-data';
import z from 'zod';
import { redirect } from 'next/navigation';

const EMAIL = 'admin@example.com';
const PASSWORD = 'password';

export default createFormAction({
  input: zdf.formData({
    email: z.string().email(),
    password: zdf.text(),
  }),
  action: async (state, { email, password }) => {

    if (email !== EMAIL || password !== PASSWORD) {
      throw new Error('Invalid email or password');
    }

    redirect('/examples/success')
  }
});
