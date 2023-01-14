import {
  Container,
  Lastseen,
  LogoIcon,
  Name,
  ProfileImageContainer,
  ProfileInfo,
  SettingsIcon,
  StyledCameraSVG,
  StyledImage,
  Upload,
  UserInfo,
  Username,
} from './Navbar.styles'
import { useContext, useEffect, useState } from 'react'

import Link from 'next/link'
import SettingsModal from '../SettingsModal'
import { UserContext } from '@/context/UserContext'
import { ImageCropper } from '@/components/Elements/ImageCropper'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

interface Props {
  username?: string
  time?: number | string
}

const Navbar = ({ username, time }: Props) => {
  const supabaseClient = useSupabaseClient()
  const [openSettings, setOpenSettings] = useState<Element | null>(null)
  const [previewProfile, setPreviewProfile] = useState<string>('')
  const [profileImage, setProfileImage] = useState(
    'https://i.ibb.co/mFg8pLH/c0c216b3743c6cb9fd67ab7df6b2c330.jpg'
  )

  const { user } = useContext(UserContext)
  const closeSettings = () => {
    setOpenSettings(null)
  }

  const handleOpenSettings = (event: React.MouseEvent<Element>) => {
    setOpenSettings(event.currentTarget)
  }

  const handleProfileImage = (file?: File) => {
    if (!file) return setPreviewProfile('')

    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') return
      setPreviewProfile(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const ProfileImageChange = async (uploadedImage: string) => {
    const { data } = supabaseClient.storage
      .from('avatars')
      .getPublicUrl(`${user?.id}/${user?.id}.png`)
    if (data.publicUrl) {
      await supabaseClient
        .from('users')
        .update({ avatar: data.publicUrl })
        .eq('id', user?.id)
      console.log(data.publicUrl)
      setProfileImage(`${data.publicUrl}?${new Date()}`)
    }
  }

  useEffect(() => {
    if (user?.avatar) {
      console.log(user)
      setProfileImage(`${user.avatar}&${new Date()}`)
    }
  }, [user?.avatar])

  console.log(profileImage)

  return (
    <Container openSettings={!!openSettings}>
      <Link href={'/'}>
        <LogoIcon />
      </Link>
      <UserInfo>
        {username && <Username>{username}</Username>}
        {username && time ? (
          <Lastseen>last seen {time} ago</Lastseen>
        ) : (
          username && <Lastseen>online</Lastseen>
        )}
      </UserInfo>
      <ProfileInfo>
        {user && (
          <>
            {previewProfile && (
              <ImageCropper
                afterCrop={ProfileImageChange}
                toggleCropper={handleProfileImage}
                image={previewProfile}
              />
            )}
            <SettingsIcon onClick={(e: any) => handleOpenSettings(e)} />
            <SettingsModal open={openSettings} onClose={closeSettings} />
            <Upload
              onChange={(event) => {
                console.log('W')
                handleProfileImage(event?.target?.files?.[0])
                return (event.currentTarget.value = '')
              }}
              id="profileImage"
              type={'file'}
            />
            <ProfileImageContainer htmlFor="profileImage">
              <StyledImage
                src={`${profileImage}?${new Date()}`}
                width={52}
                height={52}
                unoptimized={true}
                key={42343}
                alt="profile"
              />
              <StyledCameraSVG />
            </ProfileImageContainer>
            <Name>{user.username}</Name>
          </>
        )}
      </ProfileInfo>
    </Container>
  )
}

export default Navbar
