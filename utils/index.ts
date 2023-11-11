/**
 * Generates a link to access an object within a storage bucket.
 * @param {string} bucketName - The name of the storage bucket.
 * @param {string} fileName - The name of the file within the bucket.
 * @returns {string} - The URL link to the specified object.
 */
export function linkOfBucket(bucketName: string, fileName: string): string {
  const link = `http://localhost:54321/storage/v1/object/public/${bucketName}/${fileName}`
  return link
}

/**
 * Generates a link to access a product file within the 'products' bucket.
 * @param {string} fileName - The name of the product file.
 * @returns {string} - The URL link to the specified product file.
 */
export function productBucket(fileName: string): string {
  return linkOfBucket('products', fileName)
}

/**
 * Translates a sentence from French to English by replacing specific French characters.
 * @param {string} sentence - The input sentence in French.
 * @returns {string} - The translated sentence in English.
 */
export function switchAlphabet(sentence: string): string {
  const frenchToEnglishMap: { [key: string]: string } = {
    à: 'a',
    â: 'a',
    ä: 'a',
    ç: 'c',
    é: 'e',
    è: 'e',
    ê: 'e',
    ë: 'e',
    î: 'i',
    ï: 'i',
    ô: 'o',
    ö: 'o',
    ù: 'u',
    û: 'u',
    ü: 'u',
    ÿ: 'y',
  }

  // Split the input sentence into an array of characters
  const sentenceArray = sentence.split('')

  // Map each character in the array to its English equivalent
  const translatedSentence = sentenceArray.map((char) => {
    const lowercaseChar = char.toLowerCase()
    return frenchToEnglishMap[lowercaseChar] || char // Use the map if available, otherwise keep the original character
  })

  // Join the array back into a string and return the translated sentence
  return translatedSentence.join('')
}
