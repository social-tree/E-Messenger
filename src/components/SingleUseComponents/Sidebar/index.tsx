import { UserContext } from '@/context/UserContext'
import { ChannelsType, ChannelType } from '@/types/channels'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { User } from '@supabase/supabase-js'
import React, { useContext } from 'react'
import { Container, List } from './Sidebar.styles'
import SidebarItem from './SidebarItem'

interface Props {
  channels: ChannelsType
  activeChannelId: string
}

const Sidebar = ({ channels, activeChannelId }: Props) => {
  const { user } = useContext(UserContext)
  const supabaseClient = useSupabaseClient()

  return (
    <Container>
      <nav>
        <div>
          <List>
            {channels.map((channel: ChannelType) => (
              <SidebarItem
                channel={channel}
                key={channel.id}
                isActiveChannel={`${channel.id}` === activeChannelId}
                user={user}
                supabaseClient={supabaseClient}
              />
            ))}
          </List>
        </div>
      </nav>
    </Container>
  )
}

export default Sidebar
