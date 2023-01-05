import { ChannelType, ChannelsType } from '@/types/channels'
import { MessageType, MessagesType } from '@/types/messeges'
import { useContext, useEffect, useState } from 'react'

import { User } from '@supabase/supabase-js'
import { UserContext } from '@/context/UserContext'
import { fetchChannels } from '@/services/channels'
import { fetchMessages } from '@/services/messages'
import { fetchUser } from '@/services/users'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

/**
 * @param {number} channelId the currently selected Channel
 */
export const useStore = (props: { channelId: any }) => {
  const [channels, setChannels] = useState<ChannelsType>([])
  const [messages, setMessages] = useState<MessagesType>([])
  const [users] = useState(new Map())
  const { user } = useContext(UserContext)
  const [newMessage, handleNewMessage] = useState<MessageType | null>(null)
  const [newChannel, handleNewChannel] = useState(null)
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState<User | null>(null)
  const [deletedChannel, handleDeletedChannel] = useState<ChannelType | null>(
    null
  )
  const [deletedMessage, handleDeletedMessage] = useState<MessageType | null>(
    null
  )

  const supabaseClient = useSupabaseClient()

  // Load initial data and set up listeners
  useEffect(() => {
    // Get Channels
    user?.id && fetchChannels(setChannels, user.id, supabaseClient)
    // Listen for new and deleted messages
    const messageListener = supabaseClient
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => handleNewMessage(payload.new as MessageType)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => handleDeletedMessage(payload.old as MessageType)
      )
      .subscribe()
    // Listen for changes to our users
    const userListener = supabaseClient
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) =>
          /* handleNewOrUpdatedUser(payload.new) */ console.log(payload)
      )
      .subscribe()
    // Listen for new and deleted channels
    const channelListener = supabaseClient
      .channel('public:channels')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'channels' },
        (payload) => /* handleNewChannel(payload.new) */ console.log(payload)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'channels' },
        (payload) =>
          /* handleDeletedChannel(payload.old) */ console.log(payload)
      )
      .subscribe()
    // Cleanup on unmount
    return () => {
      supabaseClient.removeChannel(messageListener)
      supabaseClient.removeChannel(userListener)
      supabaseClient.removeChannel(channelListener)
    }
  }, [user?.id])

  // Update when the route changes
  useEffect(() => {
    if (props?.channelId > 0) {
      fetchMessages(
        props.channelId,
        (messages: any[]) => {
          messages?.forEach((x) => users?.set(x.user_id, x.author))
          setMessages(messages)
        },
        supabaseClient
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.channelId])

  // New message received from Postgres
  useEffect(() => {
    if (newMessage && newMessage.channel_id === Number(props.channelId)) {
      const handleAsync = async () => {
        let authorId = newMessage.user_id
        if (!users.get(authorId))
          await fetchUser(
            authorId,
            (user: any) => handleNewOrUpdatedUser(user),
            supabaseClient
          )
        setMessages(messages.concat(newMessage))
      }
      handleAsync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage])

  // Deleted message received from postgres
  useEffect(() => {
    if (deletedMessage)
      setMessages(
        messages.filter((message) => message.id !== deletedMessage.id)
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedMessage])

  // New channel received from Postgres
  useEffect(() => {
    if (newChannel) setChannels(channels.concat(newChannel))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChannel])

  // Deleted channel received from postgres
  useEffect(() => {
    if (deletedChannel)
      setChannels(
        channels.filter((channel) => channel.id !== deletedChannel.id)
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedChannel])

  // New or updated user received from Postgres
  useEffect(() => {
    if (newOrUpdatedUser) users.set(newOrUpdatedUser.id, newOrUpdatedUser)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newOrUpdatedUser])

  return {
    // We can export computed values here to map the authors to each message
    messages: messages?.map((x) => ({ ...x, author: users?.get(x.user_id) })),
    channels:
      channels !== null
        ? channels.sort((a, b) => a.slug.localeCompare(b.slug))
        : [],
    users,
  }
}
