import { useContext, useEffect, useRef } from 'react'

import UserLayout from '@/Layouts/UserLayout'
import Message from '@/components/Elements/Message'
import MessageInput from '@/components/Elements/MessageInput'
import { UserContext } from '@/context/UserContext'
import { addMessage } from '@/services/messages'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useStore } from '@/hooks/useStore'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { channel } from 'diagnostics_channel'
import dayjs from 'dayjs'
import { UpdateUserLastOnline } from '@/services/users'

const ChannelsPage = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const supabaseClient = useSupabaseClient()

  // Else load up the page
  const { id: channelId } = router.query
  const { channels, channelIds } = useStore(
    channelId ? { channelId: Number(channelId) } : { channelId: 0 }
  )

  // redirect to public channel when current channel is deleted
  /* useEffect(() => {
    if (!channels.some((channel) => channel?.id === Number(channelId))) {
      router.push('/channels/1')
    }
  }, [channels, channelId]) */

  // Render the channels and messages

  useEffect(() => {
    const Update = async () => {
      if (!user?.id) return
      await UpdateUserLastOnline(user?.id, supabaseClient)
    }
    window.addEventListener('beforeunload', Update)
    return () => {
      window.removeEventListener('beforeunload', Update)
    }
  }, [user])

  return (
    <UserLayout channelIds={channelIds} channels={channels}>
      <Container>Please select a contact to message</Container>
    </UserLayout>
  )
}

export const Messages = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  gap: 24px;
  max-height: calc(100vh - 196px);
  overflow-y: scroll;
  padding-top: 10px;
  ::-webkit-scrollbar {
    display: none;
  }
`

const Container = styled.div`
  padding: 0px 80px 20px 80px;
  max-height: calc(100vh - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
`

export default ChannelsPage
