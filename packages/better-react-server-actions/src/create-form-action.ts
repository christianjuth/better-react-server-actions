import type { z } from 'zod'
import type { zfd } from "zod-form-data";
import { formDataToObject } from './form-data';
import * as errUtils from './error'
import * as config from './config'

type ExtendState<
  State, 
  Schema extends ReturnType<typeof zfd.formData>
> = State & { 
  errors?: {
    formErrors: string[]
    fieldErrors: {
      [K in keyof z.infer<Schema>]?: string[]
    } & {
      [key: string]: string[]
    }
  }, 
}

export function createFormAction<
  State extends Record<any, any>, 
  Schema extends ReturnType<typeof zfd.formData>, 
>({
  input,
  handleServerError, 
  action
}: { 
  input: Schema, 
  handleServerError?: (err: any) => Promise<string | undefined | void>,
  action: (state: State, schema: z.infer<Schema>) => Promise<State>
}) {
  return async function (state: State, formData: FormData): Promise<ExtendState<State, Schema>> {
    const searliableFormData = formDataToObject(formData);

    const result = input.safeParse(formData);

    if (result.error) {
      const fieldErrors = result.error.issues.reduce((acc, issue) => {
        const path = issue.path.join(".");
        acc[path] = acc[path] ?? [];
        acc[path].push(issue.message);
        return acc;
      }, {} as Record<string, string[]>);

      return {
        ...state,
        [config.SECRET_FORM_DATA_KEY]: searliableFormData,
        errors: {
          fieldErrors,
          formErrors: [],
        }
      }
    }

    try {
      const newState = await action(state, result.data);

      return {
        ...newState,
        [config.SECRET_FORM_DATA_KEY]: searliableFormData,
        errors: {
          formErrors: [],
          fieldErrors: {},
        }
      }
    } catch (err) {
      if (errUtils.isNextjsRedirectError(err)) {
        throw err;
      }

      const message = 
        await handleServerError?.(err) || 
        await errUtils.extractErrorMessageFromError(err) || 
        "Unknown error"

      return {
        ...state,
        [config.SECRET_FORM_DATA_KEY]: searliableFormData,
        errors: {
          formErrors: typeof message === 'string' ? [message] : [],
          fieldErrors: {},
        }
      }
    }
  }
}
