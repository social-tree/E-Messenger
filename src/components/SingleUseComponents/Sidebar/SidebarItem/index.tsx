import { FormatDate } from '@/helpers/FormatDate'
import { imageUpdater } from '@/helpers/imageUpdater'
import { ChannelType } from '@/types/channels'
import { MessageType } from '@/types/messeges'
import { UserType } from '@/types/users'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
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
  const supabaseClient = useSupabaseClient()
  const [userChanged, setUserChanged] = useState(false)
  const [otherUser, setOtherUser] = useState<UserType>(
    channel?.to_user.id === user?.id ? channel?.created_by : channel?.to_user
  )
  const [lastMessage, setLastMessage] = useState(channel?.messages?.[0])

  useEffect(() => {
    if (!channel?.to_user.id || !user?.id || !isActiveChannel) return
    const userListener = supabaseClient
      .channel('public:users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${
            channel?.to_user.id === user?.id
              ? channel?.created_by.id
              : channel?.to_user.id
          }`,
        },
        (payload) => {
          setOtherUser(payload.new as UserType)
          setUserChanged((prev) => (prev ? false : true))
        }
      )
      .subscribe()

    const messageListener = supabaseClient
      .channel('public:messagesss')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channel?.id}`,
        },
        (payload) => {
          setLastMessage(payload.new as MessageType)
        }
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(userListener)
      supabaseClient.removeChannel(messageListener)
    }
  }, [channel, user])

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
              src={otherUser?.avatar}
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
