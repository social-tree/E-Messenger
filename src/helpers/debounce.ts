/**
 * Debounce functions for a specific duration
 * @param func the function that you want to debounce
 * @param wait the duration to wait before running the function
 */

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number
): F {
  let timeout: NodeJS.Timeout | undefined
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
    if (!timeout) func.apply(this, args)
  } as F
}
