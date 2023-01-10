import { ChannelType } from '@/types/channels'
import { User } from '@supabase/supabase-js'

/**
 * get the other user from a channel
 * @param user the current logged in user
 * @param channel the channel to get the other user from
 */

export const getUserFromChannel = (user: User, channel: ChannelType) => {
  const otherUser =
    channel?.created_by?.id === user?.id
      ? channel?.to_user
      : channel?.created_by
  return otherUser
}
