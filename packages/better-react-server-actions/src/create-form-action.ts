import type { z } from 'zod';
import type { zfd } from "zod-form-data";
import { formDataToObject } from './form-data';
import * as errUtils from './error'
import * as config from './config'

type ExtendState<
  State,
  StateSchema extends ReturnType<typeof z.object> | undefined,
  FormDataSchema extends ReturnType<typeof zfd.formData> | undefined
> = State & { 
  errors?: {
    actionErrors: string[]
    stateErrors: {
      [K in keyof StateSchema]?: string[]
    } & {
      [key: string]: string[]
    }
    formErrors: {
      [K in keyof FormDataSchema]?: string[]
    } & {
      [key: string]: string[]
    }
  }, 
}

function mapZodErrorsToObject<E extends z.ZodError<any>>(error: E) {
  return error.issues.reduce((acc, issue) => {
    const path = issue.path.join(".");
    acc[path] = acc[path] ?? [];
    acc[path].push(issue.message);
    return acc;
  }, {} as Record<string, string[]>);
}

export function createFormAction<
  StateSchema extends ReturnType<typeof z.object> | undefined = undefined,
  ParsedState = StateSchema extends ReturnType<typeof z.object>
    ? z.infer<StateSchema>
    : {},
  FormDataSchema extends ReturnType<typeof zfd.formData> | undefined = undefined,
  ParsedFormData = FormDataSchema extends ReturnType<typeof zfd.formData>
    ? z.infer<FormDataSchema>
    : undefined
>({
  formDataSchema,
  stateSchema,
  requestHandler,
  formatServerError,
}: { 
  /**
   * zod-form-data schema for validating formData
   *
   * @example
   * import { zdf } from 'zod-form-data';
   * createFormAction({
   *   formDataSchema: zfd.formData({
   *     email: zfd.text(),
   *   }),
   * });
   *
   */
  formDataSchema?: FormDataSchema, 
  /**
   * zod schema for validating state
   *
   * @example
   * import { z } from 'zod';
   * createFormAction({
   *   stateSchema: z.object({
   *     counter: z.number(),
   *   }),
   * });
   */
  stateSchema?: StateSchema,
  /**
   * A function that is called when action is triggered if form data validation passes.
   *
   * @param {ParsedState} prevState - The previous state, inferred from the state schema.
   * @param {ParsedFormData} formData - The validated form data, inferred from the form schema.
   * @returns {Promise<ParsedState>} The new state after the action has been processed.
   *
   * @example
   * createFormAction({
   *   requestHandler: async (prevState, validatedFormData) => {
   *   },
   * });
   */
  requestHandler: (
    prevState: ParsedState, 
    formData: ParsedFormData
  ) => Promise<ParsedState>
  /**
   * Return a custom error message when `requestHandler` throws. 
   * This is great for mapping verbose database errors to user-friendly messages.
   *
   * @param {any} err - The error thrown by `requestHandler`.
   * @returns {Promise<string | undefined | void>} The error message to display to the user.
   */
  formatServerError?: (err: any) => Promise<string | undefined | void>,
}) {
  return async function (state: ParsedState, formData: FormData): Promise<ExtendState<ParsedState, StateSchema, FormDataSchema>> {
    const searliableFormData = formDataToObject(formData);

    const parsedForm = formDataSchema?.safeParse(formData);

    if (parsedForm?.error) {
      return {
        ...state,
        [config.SECRET_FORM_DATA_KEY]: searliableFormData,
        errors: {
          actionErrors: [],
          stateErrors: {},
          formErrors: mapZodErrorsToObject(parsedForm.error),
        }
      }
    }

    try {
      const prevState = { ...state };

      // Clean up secret form data key and errors from prevState
      if (typeof prevState === 'object' && prevState !== null) {
        if (config.SECRET_FORM_DATA_KEY in prevState) {
          delete prevState[config.SECRET_FORM_DATA_KEY];
        }
        if ('errors' in prevState) {
          delete prevState.errors;
        }
      }

      const newState = await requestHandler(
        prevState,
        parsedForm?.data
      );

      const parsedNewState = stateSchema?.safeParse(newState);

      if (parsedNewState?.error) {
        return {
          // revert state change on invalid new state
          ...state,
          [config.SECRET_FORM_DATA_KEY]: searliableFormData,
          errors: {
            actionErrors: [],
            stateErrors: mapZodErrorsToObject(parsedNewState.error),
            formErrors: {},
          }
        }
      }

      return {
        ...newState,
        [config.SECRET_FORM_DATA_KEY]: searliableFormData,
        errors: {
          actionErrors: [],
          stateErrors: {},
          formErrors: {},
        }
      }
    } catch (err) {
      if (errUtils.isNextjsRedirectError(err)) {
        throw err;
      }

      const message = 
        await formatServerError?.(err) || 
        await errUtils.extractErrorMessageFromError(err) || 
        "Unknown error"

      return {
        ...state,
        [config.SECRET_FORM_DATA_KEY]: searliableFormData,
        errors: {
          actionErrors: typeof message === 'string' ? [message] : [],
          stateErrors: {},
          formErrors: {},
        }
      }
    }
  }
}
