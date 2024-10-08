"use server";
 
import { createActionWithState } from 'better-react-server-actions';
import { z } from 'zod';
 
export const incrementCounter = createActionWithState({
  stateSchema: z.object({
    count: z.number().min(0),
  }),
  requestHandler: async ({ count }) => {
    return {
      count: count + 1,
    }
  }
});
