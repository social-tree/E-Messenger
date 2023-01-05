import { debounce } from '@/helpers/debounce'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Fetch Settings
 * @param {number} userId
 * @param {SupabaseClient} supabaseClient client from useSupabaseClient to make queries
 */

export const fetchSettings = async (
  userId: string,
  supabaseClient: SupabaseClient
) => {
  try {
    const { data: user_settings } = await supabaseClient
      .from('users')
      .select('user_settings')
      .eq('id', userId)
      .single()

    return user_settings
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Change Theme
 * @param {number} userId
 * @param {theme} theme the current Theme
 * @param {SupabaseClient} supabaseClient client from useSupabaseClient to make queries
 */

export const changeTheme = async (
  userId: string,
  theme: string,
  supabaseClient: SupabaseClient
) => {
  try {
    let debounced = await debounce(async function yes() {
      await supabaseClient
        .from('users')
        .update({
          user_settings: { theme: theme === 'light' ? 'dark' : 'light' },
        })
        .eq('id', userId)
    }, 500)

    debounced()
  } catch (error) {
    console.log('error', error)
  }
}
