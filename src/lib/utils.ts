import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string) {
  if (!str) return str;
  return str.replace(/\w\S*/g, function (txt: string) {
    // Only change the case if the word is 4 or more characters long
    if (txt.length >= 4 && !txt.includes(".")) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    } else {
      // Return the word unchanged if it is less than 4 characters
      return txt;
    }
  });
}
