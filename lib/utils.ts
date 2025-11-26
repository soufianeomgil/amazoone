import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
      style: 'currency',
      currency: 'USD',
  }).format(price);
}
export function formatDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
export function formatFullDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
interface URlQueryParams {
  params: string;
  key: string;
  value: string | null;
}
export const formUrlQuery = ({params, key, value}:URlQueryParams)=> {
      const currentUrl = qs.parse(params)
      currentUrl[key] = value;
      return qs.stringifyUrl({
        url: window.location.pathname,
        query: currentUrl
      }, {
        skipNull: true
      })
  }

  interface RemoveURlQueryParams {
    params: string;
    keysToRemove: string[];
   
 }
  export const removeKeysFromQuery = ({params, keysToRemove}:RemoveURlQueryParams)=> {
    const currentUrl = qs.parse(params)
    keysToRemove.forEach((key)=> {
       delete currentUrl[key]
    })
    return qs.stringifyUrl({
      url: window.location.pathname,
      query: currentUrl
    }, {
      skipNull: true
    })
}

