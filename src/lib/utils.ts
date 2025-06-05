import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function prettifyText(text: string) {
  return text.replace(/\b\(/g, ' (').replace(/(\.|\,)\b/g, '$1 ')
}
