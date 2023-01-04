export type MessageType = {
  channel_id: number
  user_id: string
  inserted_at: string
  id: number
  message: string
  author: { username: string }
}

export type MessagesType = MessageType[]
