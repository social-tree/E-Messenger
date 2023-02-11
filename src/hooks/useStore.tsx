import { UserContext } from '@/context/UserContext';
import { imageUpdater } from '@/helpers/imageUpdater';
import { fetchChannels } from '@/services/channels';
import { fetchMessages } from '@/services/messages';
import { ChannelsType, ChannelType } from '@/types/channels';
import { MessagesType, MessageType } from '@/types/messeges';
import { UserType } from '@/types/users';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useContext, useEffect, useState } from 'react';

interface Props {
  channelId: number
}

export const useStore = ({ channelId }: Props) => {
  const [channels, setChannels] = useState<Map<number, ChannelType>>(new Map())
  const [messages, setMessages] = useState<MessagesType>([])
  const [users, setUser] = useState<Map<string, UserType>>(new Map())
  const { user } = useContext(UserContext)
  const [newMessage, handleNewMessage] = useState<MessageType | null>(null)
  const [newChannel, handleNewChannel] = useState<ChannelType | null>(null)
  const [newOrUpdatedUser, handleNewOrUpdatedUser] = useState<UserType | null>(
    null
  )
  const [channelIds, setChannelIds] = useState<number[]>([])
  const [deletedMessage, handleDeletedMessage] = useState<MessageType | null>(
    null
  )
  const [activeChannel, setActiveChannel] = useState<ChannelType | null>()

  const [loading, setLoading] = useState(true)

  const supabaseClient = useSupabaseClient()

  // Get all Channels
  const getChannels = async () => {
    if (user?.id) {
      setLoading(true)
      // fetch all channels
      await fetchChannels(
        (data: ChannelsType) => {
          // map with all channels to quickly grab data from
          let map = new Map()
          // array of the ids of the channels to grab the data with from
          const channelIdsArr = []

          // set all the data
          for (let i = 0; i < data.length; i++) {
            const channel = data[i]
            map.set(channel.id, {
              ...channel,
              created_by: {
                ...channel.created_by,
                avatar: imageUpdater(channel.created_by.avatar),
              },
              to_user: {
                ...channel.to_user,
                avatar: imageUpdater(channel.to_user.avatar),
              },
            })
            channelIdsArr.push(channel.id)
          }

          setChannels(map)
          setChannelIds(channelIdsArr)

          // the current active channel
          const activatedChannel = map.get(Number(channelId))
          setActiveChannel(activatedChannel)

          // the current users of the active channel
          setUser(() => {
            const newUsers = new Map()
            newUsers.set(
              activatedChannel?.created_by.id,
              activatedChannel?.created_by
            )
            newUsers.set(
              activatedChannel?.to_user.id,
              activatedChannel?.to_user
            )
            return newUsers
          })
        },
        user.id,
        supabaseClient
      )

      setLoading(false)
    }
  }

  // Load initial data and set up listeners
  useEffect(() => {
    getChannels()
    // Listen for new and deleted messages
    const messageListener = supabaseClient
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log(payload,"payload s")
          const message = payload.new as MessageType
          handleNewMessage(message)
          setChannels((prev) => {
            const newChannels = new Map(prev)
            const oldChannel = newChannels.get(message.channel_id)
            if (!oldChannel) return prev
            newChannels.set(message.channel_id, {
              ...oldChannel,
              messages: [message],
            })
            return newChannels
          })
        }
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
        (payload) => {
          const newUserUpdate = payload.new as UserType
          handleNewOrUpdatedUser(newUserUpdate)
          setUser((prev) => prev.set(newUserUpdate.id, newUserUpdate))
        }
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
    const onRouteChange = async () => {
      if (channelId > 0) {
        setLoading(true)
        await getChannels()
        await fetchMessages(
          channelId,
          (messages: any[]) => {
            setMessages(messages)
          },
          supabaseClient
        )
        setLoading(false)
      }
    }
    onRouteChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  // New message received from Postgres
  useEffect(() => {
    if (newMessage && newMessage.channel_id === Number(channelId)) {
      const handleAsync = async () => {
        let authorId = newMessage.user_id
        if(!users.get(authorId)) return
        setMessages(prev => {
          console.log([...prev,newMessage],"new")
          return [...prev,newMessage]
        })
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
    if (newChannel) setChannels((prev) => prev.set(newChannel.id, newChannel))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChannel])

  return {
    // We can export computed values here to map the authors to each message
    messages: !loading ? messages : [],
    channels: channels,
    loading,
    users,
    activeChannel,
    channelIds,
    otherUser:
      activeChannel?.created_by.id === user?.id
        ? users.get(`${activeChannel?.to_user.id}`)
        : users.get(`${activeChannel?.created_by.id}`),
  }
}
