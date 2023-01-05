import { SupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'

/**
 * Fetch all messages and their authors
 * @param {number} channelId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 * @param {SupabaseClient} supabaseClient client from useSupabaseClient to make queries
 */

export const fetchMessages = async (
  channelId: string,
  setState: Function,
  supabaseClient: SupabaseClient
) => {
  try {
    let { data } = await supabaseClient
      .from('messages')
      .select(`*, author:user_id(*)`)
      .eq('channel_id', channelId)
      .order('inserted_at', { ascending: true })
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Insert a new message into the DB
 * @param {string} message The message text
 * @param {number} channel_id
 * @param {number} user_id The author
 * @param {SupabaseClient} supabaseClient client from useSupabaseClient to make queries
 */

export const addMessage = async (
  message: string,
  channel_id: string,
  user_id: string,
  supabaseClient: SupabaseClient
) => {
  try {
    let { data } = await supabaseClient
      .from('messages')
      .insert([{ message, channel_id, user_id }])
      .select()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Delete a message from the DB
 * @param {number} message_id
 * @param {SupabaseClient} supabaseClient client from useSupabaseClient to make queries
 */

export const deleteMessage = async (
  message_id: string,
  supabaseClient: SupabaseClient
) => {
  try {
    let { data } = await supabaseClient
      .from('messages')
      .delete()
      .match({ id: message_id })
    return data
  } catch (error) {
    console.log('error', error)
  }
}
