import { SupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'

/**
 * Fetch a single user
 * @param {number} userId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUser = async (
  userId: string,
  setState: Function,
  supabaseClient: SupabaseClient
) => {
  try {
    let { data } = await supabaseClient
      .from('users')
      .select(`*`)
      .eq('id', userId)
    if (data) {
      let user = data[0]
      if (setState) setState(user)
      return user
    }
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch all roles for the current user
 * @param {function} setState Optionally pass in a hook or callback to set the state
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
