import * as config from './config';

class ReadonlyFormData {
  data: Record<string, string[]> = {}

  constructor(data: Record<string, any> = {}) {
    for (const key in data) {
      if (Array.isArray(data[key])) {
        this.data[key] = data[key].filter(v => typeof v === 'string')
      }
    }
  }

  get(key: string): string | null {
    return this.data[key]?.[0] ?? null;
  }

  getAll(key: string): string[] {
    return this.data[key] ?? [];
  }

  has(key: string): boolean {
    return key in this.data;
  }

  forEach(callbackfn: (value: string, key: string, parent: ReadonlyFormData) => void): void {
    for (const key in this.data) {
      this.data[key].forEach(value => {
        callbackfn(value, key, this);
      })
    }
  }

  entries(): IterableIterator<[string, string]> {
    const output: [string, string][] = [];
    this.forEach((value, key) => {
      output.push([key, value]);
    });
    return output.values();
  }

  keys(): IterableIterator<string> {
    const output: string[] = [];
    this.forEach((_, key) => {
      output.push(key);
    });
    return output.values();
  }

  values(): IterableIterator<string> {
    const output: string[] = [];
    this.forEach(value => {
      output.push(value);
    });
    return output.values();
  }

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return this.entries();
  }
}

export function formDataToObject(formData: FormData) {
  const output: Record<string, string[]> = {}

  formData.forEach((_, key) => {
    if (!key.startsWith('$')) {
      output[key] = formData.getAll(key).filter(v => typeof v === 'string')
    }
  });

  return output;
}

export function reconstructFormDataFromObject(data: object) {
  return new ReadonlyFormData(data);
}

export function getPreviousFormData(state: Record<any, any>) {
  const formData = typeof state[config.SECRET_FORM_DATA_KEY] === 'object' ? state[config.SECRET_FORM_DATA_KEY] as object : {};
  return reconstructFormDataFromObject(formData);
}
