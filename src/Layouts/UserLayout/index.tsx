import { ChannelType, ChannelsType } from '@/types/channels'
import { Container, UserMessages, Wrap } from './UserLayout.styles'
import { SupabaseClient, User } from '@supabase/supabase-js'
import { addChannel, deleteChannel } from '@/services/channels'

import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/SingleUseComponents/Navbar'
import TrashIcon from '@/assets/icons/TrashIcon'
import { UserContext } from '@/context/UserContext'
import { useContext } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { userRolesType } from '@/types/user_roles'
import Sidebar from '@/components/SingleUseComponents/Sidebar'
import { getUserFromChannel } from '@/helpers/getOtherUser'
import { UserType } from '@/types/users'
import dayjs from 'dayjs'

interface Props {
  channels: ChannelsType
  activeChannelId: string
  children: JSX.Element[] | JSX.Element
  user?: User | null
  time?: string
}

const UserLayout: React.FC<Props> = ({
  channels,
  activeChannelId,
  children,
  user,
  time,
}) => {
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
  }

  const lastOnline = (date?: string) => {
    if (!date) return undefined
    const lastOnlineSeconds = dayjs().diff(dayjs(date), 'seconds')
    const lastOnlineMinutes = dayjs().diff(dayjs(date), 'minutes')
    const lastOnlineHours = dayjs().diff(dayjs(date), 'hours')
    const lastOnlineDays = dayjs().diff(dayjs(date), 'days')

    return lastOnlineSeconds < 60
      ? `${lastOnlineSeconds} ${lastOnlineSeconds > 1 ? 'seconds' : 'second'}`
      : lastOnlineMinutes < 60
      ? `${lastOnlineMinutes} ${lastOnlineMinutes > 1 ? 'minutes' : 'minute'}`
      : lastOnlineHours < 23
      ? `${lastOnlineHours} ${lastOnlineHours > 1 ? 'hours' : 'hour'}`
      : lastOnlineDays < 3
      ? `${lastOnlineDays} ${lastOnlineDays > 1 ? 'days' : 'day'}`
      : `long time`
  }

  const otherUser =
    user && getUserFromChannel(user, channels[Number(activeChannelId) - 1])

  return (
    <Container>
      <Navbar
        username={otherUser?.username}
        time={lastOnline(otherUser?.last_online)}
      />
      <Wrap>
        {/* Sidebar */}
        {channels && activeChannelId && (
          <Sidebar activeChannelId={activeChannelId} channels={channels} />
        )}
        <UserMessages>{children}</UserMessages>
      </Wrap>
    </Container>
  )
}

export default UserLayout
