import { MessageType } from '@/types/messeges'
import { UserContext } from '@/context/UserContext'
import { useContext } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import {
  Container,
  DateOfCreation,
  MessageText,
  MessageWrap,
  ProfileImage,
  Username,
} from './Message.styles'
import Image from 'next/image'
import { FormatDate } from '@/helpers/FormatDate'

interface Props {
  message: MessageType
}

const Message = ({ message }: Props) => {
  const { user } = useContext(UserContext)
  const supabaseClient = useSupabaseClient()

  const myMessage = message.user_id === user?.id

  return (
    <Container myMessage={myMessage}>
      {!myMessage && (
        <ProfileImage>
          <Image src={message.author.avatar} width={40} height={40} />
        </ProfileImage>
      )}
      <MessageWrap>
        {!myMessage && <Username>{message.author?.username}</Username>}
        <MessageText myMessage={myMessage}>{message.message}</MessageText>
        <DateOfCreation>
          {FormatDate(message.inserted_at, 'hour')}
        </DateOfCreation>
      </MessageWrap>
    </Container>
  )
}

export default Message
