"use server";
 
import { createAction } from 'better-react-server-actions';
import { z } from 'zod';
 
export const toggleLike = createAction({
  stateSchema: z.object({
    likeId: z.string().optional(),
  }),
  requestHandler: async ({ likeId }) => {
    // Check if user is logged in
    // and redirect to login page if not
 
    if (likeId) {
      // Delete like via api
      return {
        likeId: undefined,
      }
    } else {
      // Create like via api
      const newLikeId = 'new-like-id';
      return {
        likeId: newLikeId,
      }
    }
  }
});
