import { FormatDate } from '@/helpers/FormatDate'
import { getOtherUser } from '@/helpers/getOtherUser'
import { ChannelType } from '@/types/channels'
import { MessageType } from '@/types/messeges'
import { SupabaseClient, User } from '@supabase/supabase-js'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  Container,
  DateOfCreation,
  Details,
  LastMessage,
  Name,
  ProfileImage,
  StyledLink,
  Top,
} from './SidebarItem.styles'

interface Props {
  channel: ChannelType
  isActiveChannel: boolean
  user?: User | null
  supabaseClient: SupabaseClient
  handleItemClick?: (otherUser: string) => void
}

const SidebarItem = ({
  channel,
  isActiveChannel,
  user,
  handleItemClick,
}: Props) => {
  // the other user of the channel and not the logged in user
  const otherUser = user && getOtherUser(user, channel)

  const [lastMessage, setLastMessage] = useState<MessageType>()

  // update last message if it has changed
  useEffect(() => {
    setLastMessage(channel?.messages?.[0])
  }, [channel])

  return (
    <StyledLink
      href={`/channels/${channel.id ? `[id]` : ''}`}
      as={`/channels/${channel.id ? channel.id : ''}`}
    >
      <Container
        onClick={() => handleItemClick && handleItemClick(channel?.to_user?.id)}
        isActiveChannel={isActiveChannel}
      >
        <>
          <ProfileImage>
            <Image
              src={`${otherUser?.avatar}`}
              width="33"
              height="33"
              alt={'profile image'}
            />
          </ProfileImage>
          <Details>
            <Top>
              <Name>{otherUser?.username}</Name>
              <DateOfCreation>
                {lastMessage && FormatDate(lastMessage.inserted_at, 'hour')}
              </DateOfCreation>
            </Top>
            <LastMessage>{lastMessage?.message}</LastMessage>
          </Details>
        </>
      </Container>
    </StyledLink>
  )
}

export default SidebarItem
