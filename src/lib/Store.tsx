import { ChannelType, ChannelsType } from '@/types/channels'
import { MessageType, MessagesType } from '@/types/messeges'
import { SetStateAction, useEffect, useState } from 'react'
import { User, createClient } from '@supabase/supabase-js'

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

const supabaseClient = createBrowserSupabaseClient()

/**
 * @param {number} channelId the currently selected Channel
 */
export const useStore = (props: { channelId: any }) => {
  const [channels, setChannels] = useState<ChannelsType>([])
  const [messages, setMessages] = useState<MessagesType>([])
  const [users] = useState(new Map())
  const [newMessage, handleNewMessage] = useState<MessageType | null>(null)
  const [newChannel, handleNewChannel] = useState(null)
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState<User | null>(null)
  const [deletedChannel, handleDeletedChannel] = useState<ChannelType | null>(
    null
  )
  const [deletedMessage, handleDeletedMessage] = useState<MessageType | null>(
    null
  )

  // Load initial data and set up listeners
  useEffect(() => {
    // Get Channels
    fetchChannels(setChannels)
    // Listen for new and deleted messages
    const messageListener = supabaseClient
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => /* handleNewMessage(payload.new) */ console.log(payload)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) =>
          /* handleDeletedMessage(payload.old) */ console.log(payload)
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
  }, [])

  // Update when the route changes
  useEffect(() => {
    if (props?.channelId > 0) {
      fetchMessages(props.channelId, (messages: any[]) => {
        messages.forEach((x) => users.set(x.user_id, x.author))
        setMessages(messages)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.channelId])

  // New message received from Postgres
  useEffect(() => {
    if (newMessage && newMessage.channel_id === Number(props.channelId)) {
      const handleAsync = async () => {
        let authorId = newMessage.user_id
        if (!users.get(authorId))
          await fetchUser(authorId, (user: any) => handleNewOrUpdatedUser(user))
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
    messages: messages.map((x) => ({ ...x, author: users.get(x.user_id) })),
    channels:
      channels !== null
        ? channels.sort((a, b) => a.slug.localeCompare(b.slug))
        : [],
    users,
  }
}

/**
 * Fetch all channels
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchChannels = async (setState: Function) => {
  try {
    let { data } = await supabaseClient.from('channels').select('*')
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch a single user
 * @param {number} userId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUser = async (userId: string, setState: Function) => {
  try {
    let { data } = await supabaseClient
      .from('users')
      .select(`*`)
      .eq('id', userId)
    if (data) {
      let user = data[0]
      if (setState) setState(user)
      return user
    }
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch all roles for the current user
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUserRoles = async (setState: Function) => {
  try {
    let { data } = await supabaseClient.from('user_roles').select(`*`)
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Fetch all messages and their authors
 * @param {number} channelId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchMessages = async (channelId: string, setState: Function) => {
  try {
    let { data } = await supabaseClient
      .from('messages')
      .select(`*, author:user_id(*)`)
      .eq('channel_id', channelId)
      .order('inserted_at', { ascending: true })
    if (setState) setState(data)
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Insert a new channel into the DB
 * @param {string} slug The channel name
 * @param {number} user_id The channel creator
 */
export const addChannel = async (slug: string, user_id: string) => {
  try {
    let { data } = await supabaseClient
      .from('channels')
      .insert([{ slug, created_by: user_id }])
      .select()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Insert a new message into the DB
 * @param {string} message The message text
 * @param {number} channel_id
 * @param {number} user_id The author
 */
export const addMessage = async (
  message: string,
  channel_id: string,
  user_id: string
) => {
  try {
    let { data } = await supabaseClient
      .from('messages')
      .insert([{ message, channel_id, user_id }])
      .select()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Delete a channel from the DB
 * @param {number} channel_id
 */
export const deleteChannel = async (channel_id: string) => {
  try {
    let { data } = await supabaseClient
      .from('channels')
      .delete()
      .match({ id: channel_id })
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Delete a message from the DB
 * @param {number} message_id
 */
export const deleteMessage = async (message_id: string) => {
  try {
    let { data } = await supabaseClient
      .from('messages')
      .delete()
      .match({ id: message_id })
    return data
  } catch (error) {
    console.log('error', error)
  }
}
