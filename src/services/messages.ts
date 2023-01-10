import { SupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'

/**
 * Fetch all messages and their authors
 * @param channelId the id of the channel to fetch messages from
 * @param setState Optionally pass in a hook or callback to set the state
 * @param supabaseClient client from useSupabaseClient to make queries
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
 * @param message The message text
 * @param channel_id the id of the channel to insert into
 * @param user_id The author
 * @param supabaseClient client from useSupabaseClient to make queries
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
 * @param message_id the id of the message to be deleted
 * @param supabaseClient client from useSupabaseClient to make queries
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
