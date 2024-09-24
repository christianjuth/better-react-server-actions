import { describe, test, expect } from 'vitest';
import { extractErrorMessageFromError, isNextjsRedirectError } from './error';

describe('error-parser', () => {

  test('extractErrorMessageFromError', async () => {
    expect(await extractErrorMessageFromError('foo')).toEqual('foo');
    expect(await extractErrorMessageFromError(new Error('bar'))).toEqual('bar');
    expect(await extractErrorMessageFromError({})).toEqual(undefined);
    expect(await extractErrorMessageFromError({ message: 'baz' })).toEqual('baz');
    expect(await extractErrorMessageFromError({ message: 42 })).toEqual(undefined);
  });

  test('isNextjsRedirectError', () => {
    expect(isNextjsRedirectError('foo')).toEqual(false);
    expect(isNextjsRedirectError(new Error('bar'))).toEqual(false);
    expect(isNextjsRedirectError({})).toEqual(false);
    expect(isNextjsRedirectError({ message: 'baz' })).toEqual(false);
    expect(isNextjsRedirectError({ message: 'NEXT_REDIRECT' })).toEqual(true);
  });

});
