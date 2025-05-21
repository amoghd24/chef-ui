import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and then merges Tailwind classes with tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date with customizable options
 */
export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }
  
  return new Date(date).toLocaleDateString(undefined, defaultOptions)
}

/**
 * Delay execution for a specified amount of time
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Check if the current client is on a mobile device
 */
export function isMobile(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 768
}

/**
 * Safe JSON parsing with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    return fallback
  }
} 