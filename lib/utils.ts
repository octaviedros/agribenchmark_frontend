import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFlagEmoji(countryCode: string) {
  return countryCode.toUpperCase().replace(/./g, char =>
    String.fromCodePoint(127397 + char.charCodeAt(0))
  );
}
