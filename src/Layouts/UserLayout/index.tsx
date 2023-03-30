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
        time={''}
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
