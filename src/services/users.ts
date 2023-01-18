import { SupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'
import dayjs from 'dayjs'

/**
 * Fetch a single user
 * @param userId the id of the user to fetch
 * @param setState Optionally pass in a hook or callback to set the state
 * @param supabaseClient client from useSupabaseClient to make queries
 */

export const fetchUser = async (
  userId: string,
  supabaseClient: SupabaseClient,
  setState?: Function
) => {
  try {
    let { data } = await supabaseClient
      .from('users')
      .select(`*`)
      .eq('id', userId)
      .single()
    if (data) {
      if (setState) setState(data)

      return data
    }
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch all roles for the current user
 * @param setState Optionally pass in a hook or callback to set the state
 * @param supabaseClient client from useSupabaseClient to make queries
 */

export const fetchUserRoles = async (
  setState: Function,
  supabaseClient: SupabaseClient
) => {
  try {
    let { data } = await supabaseClient.from('user_roles').select(`*`)
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Update users last activity date
 * @param userId id of the user that you want to update
 * @param supabaseClient client from useSupabaseClient to make queries
 * @param status status of the user
 */

export const UpdateUserLastOnline = async (
  userId: string,
  supabaseClient: SupabaseClient,
  status?: string
) => {
  try {
    let data = await supabaseClient
      .from('users')
      .update(
        status
          ? { last_online: dayjs().toISOString(), status: status }
          : { last_online: dayjs().toISOString() }
      )
      .eq('id', userId)
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Update users last activity date
 * @param userId id of the user that you want to update
 * @param status status of the user
 * @param supabaseClient client from useSupabaseClient to make queries
 */

export const UpdateUserStatus = async (
  userId: string,
  status: string,
  supabaseClient: SupabaseClient
) => {
  try {
    let data = await supabaseClient
      .from('users')
      .update({ status: status })
      .eq('id', userId)
    return data
  } catch (error) {
    console.log('error', error)
  }
  console.log(dayjs().toISOString())
}
