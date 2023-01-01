import { ChannelType, ChannelsType } from '@/types/channels'
import { SupabaseClient, User } from '@supabase/supabase-js'
import { addChannel, deleteChannel } from '@/services/channels'

import { Container } from './UserLayout.styles'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TrashIcon from '@/assets/icons/TrashIcon'
import { UserContext } from '@/context/UserContext'
import { useContext } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { userRolesType } from '@/types/user_roles'

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
  const { signOut, user } = useContext(UserContext)
  const supabaseClient = useSupabaseClient()
  console.log(user)

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

  const newChannel = async () => {
    const slug = prompt('Please enter your name')
    if (slug && user) {
      addChannel(slugify(slug), user.id, supabaseClient)
    }
  }

  return (
    <Container>
      <Navbar username={username} time={time} />
      {/* Sidebar */}
      {channels && activeChannelId && (
        <nav style={{ maxWidth: '20%', minWidth: 150, maxHeight: '100vh' }}>
          <div>
            <div>
              <button onClick={() => newChannel()}>New Channel</button>
            </div>
            <hr />
            <div>
              <h6>{user?.email}</h6>
              <button onClick={() => signOut()}>Log out</button>
            </div>
            <hr />
            <h4>Channels</h4>
            <ul>
              {channels.map((x) => (
                <SidebarItem
                  channel={x}
                  key={x.id}
                  isActiveChannel={`${x.id}` === activeChannelId}
                  user={user}
                  supabaseClient={supabaseClient}
                />
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* Messages */}
      <div>{children}</div>
    </Container>
  )
}

interface SidebarItemProps {
  channel: ChannelType
  isActiveChannel: boolean
  user?: User | null
  userRoles?: userRolesType
  supabaseClient: SupabaseClient
}

const SidebarItem = ({
  channel,
  isActiveChannel,
  user,
  userRoles,
  supabaseClient,
}: SidebarItemProps) => (
  <>
    <li className="flex items-center justify-between">
      <Link href="/channels/[id]" as={`/channels/${channel.id}`}>
        <a className={isActiveChannel ? 'font-bold' : ''}>{channel.slug}</a>
      </Link>
      {channel.id !== 1 &&
        (channel.created_by === user?.id || userRoles?.includes('admin')) && (
          <button
            onClick={() => deleteChannel(`${channel.id}`, supabaseClient)}
          >
            <TrashIcon />
          </button>
        )}
    </li>
  </>
)

export default UserLayout
