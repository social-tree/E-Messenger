import { Loading } from '@/components/Elements/Loading';
import Message from '@/components/Elements/Message';
import MessageInput from '@/components/Elements/MessageInput';
import { UserContext } from '@/context/UserContext';
import { useStore } from '@/hooks/useStore';
import UserLayout from '@/Layouts/UserLayout';
import { addMessage } from '@/services/messages';
import { MessageType } from '@/types/messeges';
import styled from '@emotion/styled';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef } from 'react';

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
    console.log(messages)
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
  max-height: calc(100vh - 140px);
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
  @media only screen and (max-width: 1100px) {
    padding: 0px 30px 20px 30px;
  }
  @media only screen and (max-width: 975px) {
    padding: 0px 10px 20px 10px;
  }
`

export default ChannelsPage
