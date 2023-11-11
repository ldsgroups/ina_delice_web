import type { IError } from './interfaces'

/**
 * Formats a phone number into a string in "XX XX XX XXXX" format.
 * @param phone - The phone number to be formatted.
 * @returns A formatted string representing the phone number in "XX XX XX XXXX" format.
 * @throws {Error} An error is thrown if the provided argument is not a valid phone number.
 */
export function formatPhoneNumber(phone: string): string {
  // throw error if phone number length is not 10
  if (phone.length !== 10)
    throw new Error('ArgumentError: phone number must be 10 digits long')

  const regexFormat = /(\d{2})(\d{2})(\d{2})(\d{4})/

  return phone.replace(regexFormat, '$1 $2 $3 $4')
}

/**
 * Formats a numeric value as a string with optional suffix, using locale-specific grouping.
 * @param number - The numeric value to be formatted.
 * @param suffix - An optional suffix to be appended to the formatted number.
 * @returns A formatted string representation of the numeric value with grouping and an optional suffix.
 * @throws {Error} An error is thrown if the provided argument is not a valid numeric value.
 */
export function formatNumber(number: number | null, suffix: string = ''): string {
  if (number === null || typeof number !== 'number')
    throw new Error('ArgumentError: number must be a numeric value') // Throw an error for invalid number argument

  // Format the numeric value using locale-specific grouping
  const formattedNumber = number.toLocaleString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')

  // Concatenate the suffix to the formatted number and return
  return formattedNumber + suffix
}

/**
 * Formats a date into a string in "HH:MM:SS" format.
 * @param date - The date to be formatted. Can be a Date object, a string in a recognized date format, or a timestamp.
 * @returns A formatted string representing the time in "HH:MM:SS" format.
 * @throws {Error} An error is thrown if the provided argument cannot be parsed as a valid date.
 */
export function formatTime(date: Date | string | number): string {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime()))
    throw new Error('ArgumentError: Invalid date') // Throw an error for invalid date argument

  // Extract hour, minute, and second components from the parsed date
  const hour = parsedDate.getHours().toString().padStart(2, '0')
  const minute = parsedDate.getMinutes().toString().padStart(2, '0')
  const second = parsedDate.getSeconds().toString().padStart(2, '0')

  // Format and return the date string in "HH:MM:SS" format
  return `${hour}:${minute}:${second}`
}

/**
 * Formats a date into a string in "DD-MM-YYYY" format.
 * @param date - The date to be formatted. Can be a Date object, a string in a recognized date format, or a timestamp.
 * @returns A formatted string representing the date in "DD-MM-YYYY" format.
 * @throws {Error} An error is thrown if the provided argument cannot be parsed as a valid date.
 */
export function formatDate(date: Date | string | number): string {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime()))
    throw new Error('ArgumentError: Invalid date') // Throw an error for invalid date argument

  // Extract day, month, and year components from the parsed date
  const day = parsedDate.getDate().toString().padStart(2, '0')
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0')
  const year = parsedDate.getFullYear().toString()

  // Format and return the date string in "DD-MM-YYYY" format
  return `${day}-${month}-${year}`
}

export function formatHumanDate(date: Date | string | number): string {
  const currentDate = new Date()
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime()))
    throw new Error('ArgumentError: Invalid date')

  const timeDiff = currentDate.getTime() - parsedDate.getTime()
  const seconds = Math.floor(timeDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0)
        return 'Just now'

      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    }
    if (hours === 1)
      return '1 hour ago'

    return `${hours} hours ago`
  }
  else if (days === 1) {
    return 'Yesterday'
  }
  else if (days === 2) {
    return '2 days ago'
  }
  else if (days < 7) {
    return `${days} days ago`
  }
  else if (weeks === 1) {
    return '1 week ago'
  }
  else if (weeks < 4) {
    return `${weeks} weeks ago`
  }
  else if (months === 1) {
    return '1 month ago'
  }
  else if (months < 12) {
    return `${months} months ago`
  }
  else if (years === 1) {
    return '1 year ago'
  }
  else {
    return `${years} years ago`
  }
}

/**
 * Checks if a given number is even (a pair number).
 * @param nb - The number to be checked.
 * @returns A computed boolean indicating whether the given number is even.
 */
export const isPairItem = (nb: number): ComputedRef<boolean> => computed(() => nb % 2 === 0)

/**
 * Formats an error message for display.
 * @param error - The error object to be formatted.
 * @returns A formatted error message.
 */
export function errorFormatter(error: IError): string {
  // Check if the error message start with blank space
  if (!error.message.startsWith(' ')) {
    return 'Impossible de se connecter au serveur' // Return a custom message for this specific error
  }
  else {
    // Remove leading characters and parentheses from the error message using regex
    const formattedMessage = error.message.replace(/^.{5}|\(.*\)/g, '').trim()
    return formattedMessage // Return the formatted error message
  }
}
