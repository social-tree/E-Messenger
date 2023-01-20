import { ChannelsType, ChannelType } from '@/types/channels'
import {
  Container,
  ShadowOverlay,
  StyledSidebar,
  UserMessages,
  Wrap,
} from './UserLayout.styles'
import { User } from '@supabase/supabase-js'

import Navbar from '@/components/SingleUseComponents/Navbar'
import { useMemo, useState } from 'react'
import Sidebar from '@/components/SingleUseComponents/Sidebar'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { UserType } from '@/types/users'

interface Props {
  channels: Map<number, ChannelType>
  activeChannel?: ChannelType | null
  children: JSX.Element[] | JSX.Element
  otherUser?: UserType | null
  channelIds: number[]
}

const UserLayout: React.FC<Props> = ({
  channels,
  children,
  activeChannel,
  channelIds,
  otherUser,
}) => {
  const [showSidebar, setShowSidebar] = useState(false)

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
      : lastOnlineDays < 7
      ? `${lastOnlineDays} ${lastOnlineDays > 1 ? 'days' : 'day'}`
      : `long time`
  }

  const toggleSidebar = () => {
    setShowSidebar((prev) => (prev ? false : true))
  }

  return (
    <Container>
      <ShadowOverlay
        onClick={() => toggleSidebar()}
        showSidebar={showSidebar}
      />
      <Navbar
        username={otherUser?.username}
        time={
          otherUser?.status === 'ONLINE'
            ? otherUser?.status
            : lastOnline(otherUser?.last_online)
        }
        toggleSidebar={toggleSidebar}
      />
      <Wrap>
        <StyledSidebar
          activeChannelId={`${activeChannel?.id}`}
          channels={channels}
          channelIds={channelIds}
          showSidebar={showSidebar}
        />
        <UserMessages>{children}</UserMessages>
      </Wrap>
    </Container>
  )
}

export default UserLayout
