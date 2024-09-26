import { describe, test, expectTypeOf } from 'vitest';
import { createActionWithState, getPreviousFormData } from '.';
import { zfd } from 'zod-form-data';
import { z } from 'zod';

describe('index', () => {

  test('action with state schema', async () => {

    const counterAction = createActionWithState({
      stateSchema: z.object({
        counter: z.number(),
      }),
      requestHandler: async (prevState, formData) => {
        expectTypeOf(prevState.counter).toEqualTypeOf<number>();
        expectTypeOf(formData).toEqualTypeOf<undefined>();
        return prevState;
      },
    });

    const counterActionResult = await counterAction({ counter: 0 }, new FormData());
    expectTypeOf(counterActionResult).toMatchTypeOf<{ counter: number, errors?: object }>();
  });

  test('action with form data schema', async () => {
    const loginAction =createActionWithState({
      formDataSchema: zfd.formData({
        email: z.string().email(),
        password: zfd.text(),
      }),
      requestHandler: async (prevState, formData) => {
        expectTypeOf(prevState).toEqualTypeOf<{}>();
        expectTypeOf(formData).toEqualTypeOf<{ email: string, password: string }>();
        return prevState;
      },
    });

    const loginActionResult = await loginAction({}, new FormData())
    expectTypeOf(loginActionResult.errors?.formErrors).toMatchTypeOf<
      {
        email?: string[] | undefined,
        password?: string[] | undefined,
      } 
      & {
        [key: string]: string[]
      } | 
      undefined
    >();

    const previousFormData = getPreviousFormData(loginActionResult);
    expectTypeOf(previousFormData.get('key')).toEqualTypeOf<string | null>();
  });

});

