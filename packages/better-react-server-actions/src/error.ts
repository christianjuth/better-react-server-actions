function parseError(err: any) {
  const errorAsObject = (typeof err === 'object' && err !== null) ? err as Record<any, any> : undefined;
  const errorAsString = typeof err === 'string' ? err : undefined;
  return { errorAsObject, errorAsString };
}

export const extractErrorMessageFromError = async (err: any): Promise<string | undefined | void> => {
  const { errorAsObject, errorAsString } = parseError(err);

  if (errorAsObject && typeof errorAsObject.message === "string") {
    return errorAsObject.message;
  }

  return errorAsString
}


/**
 * Next.js triggers redirects by throwing a special redirect error
 * We could import the function to check if this is a Next.js redirect,
 * but I want to publish this as it's own package agnostic to React meta framework
 */
export function isNextjsRedirectError(err?: any) {
  const { errorAsObject } = parseError(err);
  return errorAsObject?.message === 'NEXT_REDIRECT';
}
