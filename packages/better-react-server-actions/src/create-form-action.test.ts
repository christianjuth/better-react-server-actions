import { describe, test, expect, vitest } from 'vitest';
import { createAction } from './create-form-action';
import { zfd } from 'zod-form-data';
import { z } from 'zod';

const USERNAME = 'admin';
const PASSWORD = 'password';
const INVALID_LOGIN_ERROR = 'Invalid username or password';

function createLoginAction() {
  const fn = vitest.fn();
  const login = createAction({
    formDataSchema: zfd.formData({
      username: zfd.text(),
      password: zfd.text(),
    }),
    requestHandler: async (...args) => {
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

      expect(result.errors?.actionErrors).toEqual([]);
      expect(result.errors?.formErrors).toEqual({});
    });

    test('missing username', async () => {
      const { login, fn } = createLoginAction();

      const formData = new FormData();
      formData.append('password', PASSWORD);

      const result = await login({}, formData);

      expect(fn).toBeCalledTimes(0);

      expect(result.errors?.formErrors).toHaveProperty('username');
      expect(result.errors?.formErrors).not.toHaveProperty('password');
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
      
      expect(result.errors?.actionErrors).toEqual([INVALID_LOGIN_ERROR]);
      expect(result.errors?.formErrors).toEqual({});
    });

    test('valid state update', async () => {
      
      const fn = vitest.fn();
      const increment = createAction({
        stateSchema: z.object({
          count: z.number().min(0),
        }),
        requestHandler: async (...args) => {
          fn(...args);
          const [state] = args;
          return { count: state.count + 1 };
        }
      });

      const result = await increment({ count: 0 });

      expect(result.count).toBe(1);
    });

    test('invalid state update', async () => {
      
      const fn = vitest.fn();
      const increment = createAction({
        stateSchema: z.object({
          count: z.number().min(0),
        }),
        requestHandler: async (...args) => {
          fn(...args);
          return { count: -1 };
        }
      });

      const result = await increment({ count: 0 });

      expect(result.count).toBe(0);
      expect(result.errors?.stateErrors).toHaveProperty('count');
    });

    test('toggle state', async () => {
      
      const fn = vitest.fn();
      const increment = createAction({
        stateSchema: z.object({
          value: z.boolean(),
        }),
        requestHandler: async (...args) => {
          fn(...args);
          const [state] = args;
          return { value: !state.value };
        }
      });

      let result = await increment({ value: false });
      expect(result.value).toBe(true);
      result = await increment(result);
      expect(result.value).toBe(false);
    });


  });

});
