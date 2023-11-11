import type { Database } from '~/types/supabase'

export default defineNuxtPlugin((_) => {
  const csSupabase = useSupabaseClient<Database>()
  const csSupabaseUser = useSupabaseUser()

  async function csSequencer(): Promise<string> {
    // Get the current date in ISO format.
    const today = new Date().toISOString()

    // Define constants for the sequencer code.
    const letter = 'VT'
    const year = today.slice(2, 4)
    const month = today.slice(5, 7)

    const { data: lastOrder } = await csSupabase.from('orders').select('name').order('created_at', { ascending: false }).limit(1)

    // Initialize a variable to store the last order's month time.
    let lastOrderMonthTime = ''

    // Check if there are no previous orders.
    if (!lastOrder?.length) {
      lastOrderMonthTime = '00'
    }
    else {
      // Check if the last order's month time is not a number.
      if (Number.isNaN(lastOrder[0].name.substring(6))) {
        throw createError({
          message: 'Error while generating sequencer',
          data: {},
          statusCode: 500,
          statusMessage: 'Internal Server Error',
        })
      }
      else {
        lastOrderMonthTime = lastOrder[0].name.substring(6)
      }
    }

    // Generate a new sequence number for the current month.
    let newSeq = ''

    // check if we are on the current month
    const isSomeMonth = lastOrder?.length ? lastOrder[0].name.substring(4, 6) === month ? 'yes' : 'no' : 'new'

    if (isSomeMonth === 'yes')
      newSeq = Number(lastOrderMonthTime) + 1 > 9 ? `${Number(lastOrderMonthTime) + 1}` : `0${Number(lastOrderMonthTime) + 1}`
    else
      newSeq = '01'

    // Combine the components to create the final sequencer code.
    const sequencer = `${letter}${year}${month}${newSeq}`
    // Return the generated sequencer code.
    return sequencer
  }

  return {
    provide: {
      csSupabase,
      csSupabaseUser,
      csSequencer,
    },
  }
})
