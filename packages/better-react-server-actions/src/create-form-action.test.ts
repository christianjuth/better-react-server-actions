import { describe, test, expect, vitest } from 'vitest';
import { createFormAction } from './create-form-action';
import * as zfd from 'zod-form-data';

const USERNAME = 'admin';
const PASSWORD = 'password';
const INVALID_LOGIN_ERROR = 'Invalid username or password';

function createLoginAction() {
  const fn = vitest.fn();
  const login = createFormAction({
    input: zfd.formData({
      username: zfd.text(),
      password: zfd.text(),
    }),
    action: async (...args) => {
      fn(...args);
      const [state, { username, password }] = args;
      if (username !== USERNAME || password !== PASSWORD) {
        throw new Error(INVALID_LOGIN_ERROR);
      }
      return state;
    }
  });

  return { login, fn };
}

describe('create-form-action', () => {
  
  describe('login form', async () => {

    test('valid form data', async () => {
      const { login, fn } = createLoginAction();

      const formData = new FormData();
      formData.append('username', USERNAME);
      formData.append('password', PASSWORD);

      const result = await login({}, formData);

      expect(fn.mock.calls).toEqual([
        [{}, { username: USERNAME, password: PASSWORD }]
      ]);

      expect(result.errors?.formErrors).toEqual([]);
      expect(result.errors?.fieldErrors).toEqual({});
    });

    test('missing username', async () => {
      const { login, fn } = createLoginAction();

      const formData = new FormData();
      formData.append('password', PASSWORD);

      const result = await login({}, formData);

      expect(fn).toBeCalledTimes(0);

      expect(result.errors?.fieldErrors).toHaveProperty('username');
      expect(result.errors?.fieldErrors).not.toHaveProperty('password');
    });

    test('invalid password', async () => {
      const { login, fn } = createLoginAction();

      const formData = new FormData();
      formData.append('username', USERNAME);
      formData.append('password', 'wrong-password');

      const result = await login({}, formData);

      expect(fn.mock.calls).toEqual([
        [{}, { username: USERNAME, password: 'wrong-password' }]
      ]);
      
      expect(result.errors?.formErrors).toEqual([INVALID_LOGIN_ERROR]);
      expect(result.errors?.fieldErrors).toEqual({});
    });


  });

});
