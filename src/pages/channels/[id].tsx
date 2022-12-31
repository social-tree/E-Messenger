import { useContext, useEffect, useRef } from 'react'

import Layout from '@/Layouts/UserLayout'
import Message from '@/components/Elements/Message'
import MessageInput from '@/components/Elements/MessageInput'
import { UserContext } from '@/context/UserContext'
import { addMessage } from '@/services/messages'
import { useRouter } from 'next/router'
import { useStore } from '@/hooks/useStore'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

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
  useEffect(() => {
    if (!channels.some((channel) => channel?.id === Number(channelId))) {
      router.push('/channels/1')
    }
  }, [channels, channelId])

  // Render the channels and messages
  return (
    <Layout channels={channels} activeChannelId={channelId as string}>
      <div className="relative h-screen">
        <div className="Messages h-full pb-16">
          <div className="p-2 overflow-y-auto">
            {messages.map((x) => (
              <Message key={x.id} message={x} />
            ))}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
        <div className="p-2 absolute bottom-0 left-0 w-full">
          <MessageInput
            onSubmit={async (text: string) =>
              user &&
              addMessage(text, channelId as string, user.id, supabaseClient)
            }
          />
        </div>
      </div>
    </Layout>
  )
}

export default ChannelsPage
