import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * A utility function that combines and merges CSS classes.
 * - It uses `clsx` to conditionally apply classes and `tailwind-merge` to resolve conflicting classes.
 * - This is useful for creating dynamic and customizable components with Tailwind CSS.
 *
 * @param {...ClassValue[]} inputs - A list of class values to be combined.
 * @returns {string} The combined and merged CSS class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
