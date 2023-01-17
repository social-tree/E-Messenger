import { ChannelsType } from '@/types/channels'
import { Container, UserMessages, Wrap } from './UserLayout.styles'
import { User } from '@supabase/supabase-js'

import Navbar from '@/components/SingleUseComponents/Navbar'
import { useMemo } from 'react'
import Sidebar from '@/components/SingleUseComponents/Sidebar'
import { getUserFromChannel } from '@/helpers/getOtherUser'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

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
}) => {
  const router = useRouter()

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

  const otherUser = useMemo(() => {
    if (!user || !activeChannelId || channels.length === 0) return
    let map = new Map()
    for (let i = 0; i < channels.length; i++) {
      map.set(channels[i].id, channels[i])
    }
    const result = map.get(Number(activeChannelId))
    if (!result) {
      router.push('/channels/')
    }
    return result && getUserFromChannel(user, result)
  }, [user, channels])

  return (
    <Container>
      <Navbar
        username={otherUser?.username}
        time={
          otherUser?.status === 'ONLINE'
            ? otherUser?.status
            : lastOnline(otherUser?.last_online)
        }
      />
      <Wrap>
        <Sidebar activeChannelId={activeChannelId} channels={channels} />
        <UserMessages>{children}</UserMessages>
      </Wrap>
    </Container>
  )
}

export default UserLayout
