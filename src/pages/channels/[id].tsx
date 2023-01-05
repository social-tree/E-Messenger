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

const ChannelsPage = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const supabaseClient = useSupabaseClient()

  // Else load up the page
  const { id: channelId } = router.query
  const { messages, channels } = useStore({ channelId })

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    })
  }, [messages])

  // redirect to public channel when current channel is deleted
  /* useEffect(() => {
    if (!channels.some((channel) => channel?.id === Number(channelId))) {
      router.push('/channels/1')
    }
  }, [channels, channelId]) */

  // Render the channels and messages
  return (
    <UserLayout
      user={user}
      channels={channels}
      activeChannelId={channelId as string}
    >
      <Container>
        <Messages>
          {messages?.map((x, index) => {
            const orderType =
              messages[index - 1]?.author?.id !== x.author.id &&
              messages[index + 1]?.author?.id !== x.author.id
                ? 'first'
                : messages[index - 1]?.author?.id !== x.author.id
                ? 'start'
                : messages[index + 1]?.author?.id === x.author.id
                ? 'middle'
                : messages[index - 1]?.author?.id === x.author.id &&
                  messages[index + 1]?.author?.id !== x.author.id
                ? 'end'
                : 'other'

            return <Message orderType={orderType} key={x.id} message={x} />
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
