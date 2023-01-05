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
