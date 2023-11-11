import { ZodError } from 'zod'
import type { IError } from '~/utils/interfaces'

/**
 * Creates an error displayer function that displays formatted error messages based on the error type.
 * @returns An error displayer function.
 */
export function useErrorDisplayer() {
  const { appContext } = getCurrentInstance()!

  /**
   * Display error messages based on the type of error.
   * @param error - The error to be displayed.
   */
  return (error: IError): void => {
    if (error instanceof ZodError) {
      ElMessage({
        message: `${error.errors[0].message}`,
        type: 'warning',
        appContext,
      })
    }
    else {
      ElMessage({
        message: `${error.message}`,
        type: 'error',
        duration: 5000,
        appContext,
      })
    }
  }
}
