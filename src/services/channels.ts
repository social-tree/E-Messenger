import { SupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'

/**
 * Insert a new channel into the DB
 * @param {string} slug The channel name
 * @param {number} user_id The channel creator
 * @param {SupabaseClient} supabaseClient client from useSupabaseClient to make queries
 */
export const addChannel = async (
  slug: string,
  user_id: string,
  supabaseClient: SupabaseClient
) => {
  try {
    let { data } = await supabaseClient
      .from('channels')
      .insert([{ slug, created_by: user_id }])
      .select()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Delete a channel from the DB
 * @param {number} channel_id
 * @param {SupabaseClient} supabaseClient client from useSupabaseClient to make queries
 */

export const deleteChannel = async (
  channel_id: string,
  supabaseClient: SupabaseClient
) => {
  try {
    let { data } = await supabaseClient
      .from('channels')
      .delete()
      .match({ id: channel_id })
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch all channels
 * @param {function} setState Optionally pass in a hook or callback to set the state
 * @param {SupabaseClient} supabaseClient client from useSupabaseClient to make queries
 */

export const fetchChannels = async (
  setState: Function,
  id: string,
  supabaseClient: SupabaseClient
) => {
  try {
    let { data } = await supabaseClient
      .from('channels')
      .select(
        `*, to_user:users!channels_to_user_fkey(*),created_by:users!channels_created_by_fkey(*),messages:messages!id(*)`
      )
      .or(`created_by.eq.${id},to_user.eq.${id}`)
      .order('inserted_at', { ascending: false, foreignTable: 'messages' })
      .limit(1, { foreignTable: 'messages' })

    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
  }
}
