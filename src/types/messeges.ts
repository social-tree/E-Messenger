import { UserType } from './users'

export type MessageType = {
  channel_id: number
  user_id: string
  inserted_at: string
  id: number
  message: string
  author: UserType
}

export type MessagesType = MessageType[]
