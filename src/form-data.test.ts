import { describe, test, expect, vitest } from 'vitest';
import { formDataToObject, reconstructFormDataFromObject } from './form-data';

const formData = new FormData(); formData.append('a', '1');
formData.append('a', '2');
formData.append('b', '3');
formData.append('c', '4');

const formDataAsObject = formDataToObject(formData);
const stringified = JSON.stringify(formDataAsObject);
const parsed = JSON.parse(stringified);
const reconstructed = reconstructFormDataFromObject(parsed);

describe('form-data', () => {

    test('forEach', () => {
      const fn1 = vitest.fn();
      const fn2 = vitest.fn();

      reconstructed.forEach(fn1);
      formData.forEach(fn2);

      // We only care about the first two arguments
      expect(
        fn1.mock.calls.map(([a,b]) => [a,b])
      ).toEqual(
        fn2.mock.calls.map(([a,b]) => [a,b])
      );

    });

    test('get', () => {
      expect(reconstructed.get('a')).toEqual(formData.get('a'));
      expect(reconstructed.get('b')).toEqual(formData.get('b'));
      expect(reconstructed.get('c')).toEqual(formData.get('c'));
    });

    test('getAll', () => {
      expect(reconstructed.getAll('a')).toEqual(formData.getAll('a'));
      expect(reconstructed.getAll('b')).toEqual(formData.getAll('b'));
      expect(reconstructed.getAll('c')).toEqual(formData.getAll('c'));
    });

    test('has', () => {
      expect(reconstructed.has('a')).toEqual(formData.has('a'));
      expect(reconstructed.has('b')).toEqual(formData.has('b'));
      expect(reconstructed.has('c')).toEqual(formData.has('c'));
      expect(reconstructed.has('d')).toEqual(formData.has('d'));
      expect(reconstructed.has('e')).toEqual(formData.has('e'));
    });

  test('entries', () => {
    expect(Array.from(reconstructed.entries())).toEqual(Array.from(formData.entries()));
  });

  test('keys', () => {
    expect(Array.from(reconstructed.keys())).toEqual(Array.from(formData.keys()));
  });

  test('values', () => {
    expect(Array.from(reconstructed.values())).toEqual(Array.from(formData.values()));
  });

  // test('Symbol.iterator', () => {
  //   expect(Array.from(reconstructed)).toEqual(Array.from(formData));
  // });

});
