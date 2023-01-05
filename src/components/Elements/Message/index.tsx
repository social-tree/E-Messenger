import { MessageType } from '@/types/messeges'
import { UserContext } from '@/context/UserContext'
import { useContext } from 'react'
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
  orderType: string
}

const Message = ({ message, orderType }: Props) => {
  const { user } = useContext(UserContext)
  const myMessage = message.user_id === user?.id

  return (
    <Container myMessage={myMessage} orderType={orderType}>
      {!myMessage && (orderType === 'end' || orderType === 'first') && (
        <ProfileImage>
          <Image src={message.author.avatar} width={40} height={40} />
        </ProfileImage>
      )}
      <MessageWrap>
        {!myMessage && (orderType === 'start' || orderType === 'first') && (
          <Username>{message.author?.username}</Username>
        )}
        <MessageText myMessage={myMessage}>{message.message}</MessageText>
        <DateOfCreation myMessage={myMessage}>
          {FormatDate(message.inserted_at, 'hour')}
        </DateOfCreation>
      </MessageWrap>
    </Container>
  )
}

export default Message
