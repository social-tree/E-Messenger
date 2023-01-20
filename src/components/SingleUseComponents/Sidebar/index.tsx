import { UserContext } from '@/context/UserContext'
import { debounce } from '@/helpers/debounce'
import { addChannel, fetchChannel, fetchChannels } from '@/services/channels'
import { ChannelsType, ChannelType } from '@/types/channels'
import { UserType } from '@/types/users'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Router, { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Container, List, SearchTitle, StyledInput } from './Sidebar.styles'
import SidebarItem from './SidebarItem'

interface Props {
  channels: Map<number, ChannelType>
  activeChannelId: string
  channelIds: number[]
  className?: string
}

const Sidebar = ({
  channels,
  activeChannelId,
  channelIds,
  className,
}: Props) => {
  const {
    control,
    register,
    formState: { errors },
  } = useForm()
  const { user } = useContext(UserContext)
  const router = useRouter()
  const supabaseClient = useSupabaseClient()

  const [users, setUsers] = useState<UserType[]>([])

  // function to search through users by text
  const searchUsers = async (text: string) => {
    const { data } = await supabaseClient
      .from('users')
      .select('*')
      .textSearch('username', `${text}`, {
        type: 'websearch',
        config: 'english',
      })
    data && data?.length > 0 ? setUsers(data) : setUsers([])
  }

  const debouncedSearchUsers = debounce(
    (value: string) => searchUsers(value),
    1000
  )

  // handle the click of the search and create a new channel to that user or redirect to already existing one
  const handleItemClick = async (otherUserId: string) => {
    if (!user?.id) return
    const addedChannel = await addChannel(otherUserId, user.id, supabaseClient)

    if (addedChannel?.error?.code === '42501') {
      const alreadyAddedChannel = await fetchChannel(
        user?.id,
        otherUserId,
        supabaseClient
      )

      //redirect if channel already exists
      router.push(`/channels/${alreadyAddedChannel?.id}`)
    }
    // redirect if channel created
    addedChannel?.data?.id && router.push(`channels/${addedChannel.data?.id}`)
  }

  return (
    <Container className={className}>
      <nav>
        <div>
          <List>
            <StyledInput
              control={control}
              {...register('search')}
              errors={errors}
              onChange={(e) =>
                debouncedSearchUsers((e.target as HTMLInputElement).value)
              }
              inputProps={{ placeholder: 'Search' }}
            />
            {users.length > 0 && (
              <>
                <hr />
                <SearchTitle>Global Search Results</SearchTitle>
                <hr />
              </>
            )}

            {/* show users when searching */}
            {users.length > 0
              ? users.map((user: UserType) => (
                  <SidebarItem
                    handleItemClick={handleItemClick}
                    channel={{
                      to_user: user,
                      created_by: user,
                      id: 0,
                      inserted_at: '',
                    }}
                    key={user.id}
                    isActiveChannel={false}
                    user={user}
                    supabaseClient={supabaseClient}
                  />
                ))
              : channelIds?.map((id: number) => {
                  const channel = channels.get(id)
                  return (
                    channel && (
                      <SidebarItem
                        channel={channel}
                        key={channel.id}
                        isActiveChannel={`${channel.id}` === activeChannelId}
                        user={user}
                        supabaseClient={supabaseClient}
                      />
                    )
                  )
                })}
          </List>
        </div>
      </nav>
    </Container>
  )
}

export default Sidebar
