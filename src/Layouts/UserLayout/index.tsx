import { ChannelType, ChannelsType } from '@/types/channels'
import { Container, UserMessages, Wrap } from './UserLayout.styles'
import { SupabaseClient, User } from '@supabase/supabase-js'
import { addChannel, deleteChannel } from '@/services/channels'

import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Elements/Navbar'
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
      <Wrap>
        {/* Sidebar */}
        {channels && activeChannelId && (
          <nav style={{ maxWidth: '20%', minWidth: 150 }}>
            <div>
              {/*  <div>
              <button onClick={() => newChannel()}>New Channel</button>
            </div> */}
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
        <UserMessages></UserMessages>
      </Wrap>
    </Container>
  )
}

interface SidebarItemProps {
  channel: ChannelType
  isActiveChannel: boolean
  user?: User | null
  supabaseClient: SupabaseClient
}

const SidebarItem = ({ channel, isActiveChannel, user }: SidebarItemProps) => (
  <>
    <li>
      <Image
        src={`${
          channel?.to_user.id === user?.id
            ? channel?.created_by.avatar
            : channel?.to_user.avatar
        }`}
        width="33"
        height="33"
        alt={'profile image'}
      />
      <Link href="/channels/[id]" as={`/channels/${channel.id}`}>
        <a>{channel.slug}</a>
      </Link>
    </li>
  </>
)

export default UserLayout
