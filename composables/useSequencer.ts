// const { $csSupabase } = useNuxtApp()

// /**
//  * Generates a unique sequencer code for orders based on the current date and the order history.
//  * @param event - The event triggering the sequencer generation (if any).
//  * @returns {Promise<string>} - A unique sequencer code for the new order.
//  */
// export async function useSequencer(): Promise<string> {
//   // Get the current date in ISO format.
//   const today = new Date().toISOString()

//   // Define constants for the sequencer code.
//   const letter = 'VT'
//   const year = today.slice(2, 4)
//   const month = today.slice(5, 7)

//   const { data: lastOrder } = await $csSupabase.from('orders').select('name').order('createdAt', { ascending: false }).single()

//   // Initialize a variable to store the last order's month time.
//   let lastOrderMonthTime = ''

//   // Check if there are no previous orders.
//   if (lastOrder === null) {
//     lastOrderMonthTime = '00'
//   }
//   else {
//     // Check if the last order's month time is not a number.
//     if (Number.isNaN(lastOrder.name.substring(6))) {
//       throw createError({
//         message: 'Error while generating sequencer',
//         data: {},
//         statusCode: 500,
//         statusMessage: 'Internal Server Error',
//       })
//     }
//     else {
//       lastOrderMonthTime = lastOrder.name.substring(6)
//     }
//   }

//   // Generate a new sequence number for the current month.
//   const newSeq = Number(lastOrderMonthTime) + 1 > 9 ? `${Number(lastOrderMonthTime) + 1}` : `0${Number(lastOrderMonthTime) + 1}`
//   // Combine the components to create the final sequencer code.
//   const sequencer = `${letter}${year}${month}${newSeq}`
//   // Return the generated sequencer code.
//   return sequencer
// }
