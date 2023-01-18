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
import { Loading } from '@/components/Elements/Loading'
import { MessageType } from '@/types/messeges'

const ChannelsPage = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const supabaseClient = useSupabaseClient()

  // Else load up the page
  const { id: channelId } = router.query
  const {
    messages,
    channels,
    loading,
    users,
    activeChannel,
    channelIds,
    otherUser,
  } = useStore(channelId ? { channelId: Number(channelId) } : { channelId: 0 })

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    })
  }, [messages])

  if (loading) {
    return <Loading />
  }

  return (
    <UserLayout
      otherUser={otherUser}
      channels={channels}
      channelIds={channelIds}
      activeChannel={activeChannel}
    >
      <Container>
        <Messages>
          {messages?.map((x, index) => {
            const orderType =
              messages[index - 1]?.author?.id !== x.author?.id &&
              messages[index + 1]?.author?.id !== x.author?.id
                ? 'first'
                : messages[index - 1]?.author?.id !== x.author?.id
                ? 'start'
                : messages[index + 1]?.author?.id === x.author?.id
                ? 'middle'
                : messages[index - 1]?.author?.id === x.author?.id &&
                  messages[index + 1]?.author?.id !== x.author?.id
                ? 'end'
                : 'other'
            return (
              <Message
                orderType={orderType}
                key={`${x?.id}`}
                message={x as MessageType}
              />
            )
          })}
          <div ref={messagesEndRef} style={{ height: 0 }} />
        </Messages>
        <MessageInput
          onSubmit={async (message: string) =>
            user &&
            addMessage(message, channelId as string, user.id, supabaseClient)
          }
        />
      </Container>
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
  height: 100%;
  flex-direction: column;
`

export default ChannelsPage
