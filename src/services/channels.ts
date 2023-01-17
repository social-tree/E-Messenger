import { SupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'

/**
 * Insert a new channel into the DB
 * @param to_user The channel responder
 * @param created_by The channel creator
 * @param supabaseClient client from useSupabaseClient to make queries
 */
export const addChannel = async (
  to_user: string,
  created_by: string,
  supabaseClient: SupabaseClient
) => {
  try {
    let { data } = await supabaseClient
      .from('channels')
      .insert([{ to_user, created_by }])
      .select()
      .single()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Delete a channel from the DB
 * @param channel_id the id of the channel to delete
 * @param supabaseClient client from useSupabaseClient to make queries
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
 * Fetch all channels of a user
 * @param setState Optionally pass in a hook or callback to set the state
 * @param userId the id of the user to fetch the channels that belong to the user
 * @param supabaseClient client from useSupabaseClient to make queries
 */

export const fetchChannels = async (
  setState: Function,
  userId: string,
  supabaseClient: SupabaseClient
) => {
  try {
    let { data } = await supabaseClient
      .from('channels')
      .select(
        `*, to_user:users!channels_to_user_fkey(*),created_by:users!channels_created_by_fkey(*),messages:messages!id(*)`
      )
      .or(`created_by.eq.${userId},to_user.eq.${userId}`)
      .order('inserted_at', { ascending: false, foreignTable: 'messages' })
      .limit(1, { foreignTable: 'messages' })
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
  }
}
