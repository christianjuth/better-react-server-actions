"use server";
 
import { createAction } from 'better-react-server-actions';
import { z } from 'zod';
 
export const incrementCounter = createAction({
  stateSchema: z.object({
    count: z.number().min(0),
  }),
  requestHandler: async ({ count }) => {
    return {
      count: count + 1,
    }
  }
});
