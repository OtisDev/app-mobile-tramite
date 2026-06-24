import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toFormData(data: Record<string, any>): FormData 
{
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

export function toStringQuery(params: Record<string, any>): string {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined)
      .reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: String(value),
        }),
        {}
      )
  ).toString();
}

export function getQueryUrl<T = Record<string, string | string[]>>(
  url: string
): T {
  const params = new URL(
    url,
    'http://localhost'
  ).searchParams;

  return Object.fromEntries(
    params.entries()
  ) as T;
}

export function appendQueryParams(
  url: string,
  params: Record<string, any>
): string {
  const urlObj = new URL(url, "http://localhost");

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      urlObj.searchParams.delete(key);
      return;
    }

    urlObj.searchParams.set(key, String(value));
  });

  return url.startsWith("http")
    ? urlObj.toString()
    : `${urlObj.pathname}${urlObj.search}`;
}