import { UserType } from './users'

export type ChannelType = {
  id: number
  inserted_at: string
  created_by: UserType
  slug: string
  to_user: UserType
}

export type ChannelsType = ChannelType[]
