import { MessagesType } from './messeges'
import { UserType } from './users'

export type ChannelType = {
  id: number
  inserted_at: string
  created_by: UserType
  messages?: MessagesType
  slug?: string
  to_user: UserType
}

export type ChannelsType = ChannelType[]
