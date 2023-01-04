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

interface Props {
  channels?: ChannelsType
  activeChannelId?: string
  children: JSX.Element[] | JSX.Element
  username?: string
  time?: string
}

const UserLayout: React.FC<Props> = ({
  channels,
  activeChannelId,
  children,
  username,
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

  return (
    <Container>
      <Navbar username={username} time={time} />
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
