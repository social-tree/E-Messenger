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
import { imageUpdater } from '@/helpers/imageUpdater'

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

  // close settings
  const closeSettings = () => {
    setOpenSettings(null)
  }

  // open settings
  const handleOpenSettings = (event: React.MouseEvent<Element>) => {
    setOpenSettings(event.currentTarget)
  }

  // toggle the image cropper component
  const handleProfileImage = (file?: File) => {
    if (!file) return setPreviewProfile('')

    // make the image readable to the cropper
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') return
      // set the image that will be displayed on the cropper and toggle it on
      setPreviewProfile(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // change profile image to the new edited version in navbar and in database
  const ProfileImageChange = async (uploadedImage: string) => {
    const { data } = supabaseClient.storage
      .from('avatars')
      .getPublicUrl(`${user?.id}/${user?.id}.png`)
    if (data.publicUrl) {
      await supabaseClient
        .from('users')
        .update({ avatar: data.publicUrl })
        .eq('id', user?.id)
      setProfileImage(imageUpdater(data.publicUrl))
    }
  }

  // set navbar profileImage from user
  useEffect(() => {
    if (user?.avatar) {
      setProfileImage(user.avatar)
    }
  }, [user?.avatar, time])

  return (
    <Container openSettings={!!openSettings}>
      <Link href={'/'}>
        <LogoIcon />
      </Link>
      {/* show user status/username */}
      <UserInfo>
        {username && <Username>{username}</Username>}
        {username && time !== 'ONLINE' ? (
          <Lastseen>last seen {time} ago</Lastseen>
        ) : (
          username && <Lastseen>is online</Lastseen>
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
                handleProfileImage(event?.target?.files?.[0])
                return (event.currentTarget.value = '')
              }}
              id="profileImage"
              type={'file'}
            />
            <ProfileImageContainer htmlFor="profileImage">
              <StyledImage
                src={`${profileImage}`}
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
