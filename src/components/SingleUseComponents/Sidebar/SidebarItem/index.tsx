import { FormatDate } from '@/helpers/FormatDate'
import { ChannelType } from '@/types/channels'
import { SupabaseClient, User } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
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
}

const SidebarItem = ({ channel, isActiveChannel, user }: Props) => {
  const otherUser =
    channel?.to_user.id === user?.id ? channel?.created_by : channel?.to_user

  const LastMessageSent = channel?.messages?.[0]

  return (
    <StyledLink href="/channels/[id]" as={`/channels/${channel.id}`}>
      <Container isActiveChannel={isActiveChannel}>
        <>
          <ProfileImage>
            <Image
              src={`${otherUser.avatar}`}
              width="33"
              height="33"
              alt={'profile image'}
            />
          </ProfileImage>
          <Details>
            <Top>
              <Name>{otherUser.username}</Name>
              <DateOfCreation>
                {LastMessageSent &&
                  FormatDate(LastMessageSent.inserted_at, 'hour')}
              </DateOfCreation>
            </Top>
            <LastMessage>{LastMessageSent?.message}</LastMessage>
          </Details>
        </>
      </Container>
    </StyledLink>
  )
}

export default SidebarItem
