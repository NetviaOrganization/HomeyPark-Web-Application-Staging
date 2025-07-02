/**
 * Checks if the provided value is a Promise
 * @param value The value to check
 * @returns True if the value is a Promise, false otherwise
 */
import { MaybePromise } from '../types'
export function isPromise<T = unknown>(
  value: MaybePromise<T>
): value is Promise<T> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof (value as Promise<T>).then === 'function'
  )
}
