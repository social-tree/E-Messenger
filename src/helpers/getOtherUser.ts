import { ChannelType } from '@/types/channels'
import { User } from '@supabase/supabase-js'

export const getUserFromChannel = (user: User, channel: ChannelType) => {
  const otherUser =
    channel?.created_by?.id === user?.id
      ? channel?.to_user
      : channel?.created_by
  return otherUser
}
