import {
  Container,
  Lastseen,
  FullLogoIcon,
  Name,
  ProfileImageContainer,
  ProfileInfo,
  SettingsIcon,
  StyledCameraSVG,
  StyledImage,
  Upload,
  UserInfo,
  Username,
  LogoIcon,
  StyledSidebar,
} from './Navbar.styles'
import { useContext, useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import SettingsModal from '../SettingsModal'
import { UserContext } from '@/context/UserContext'
import { ImageCropper } from '@/components/Elements/ImageCropper'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { imageUpdater } from '@/helpers/imageUpdater'
import { useMediaQuery } from '@mui/material'

interface Props {
  username?: string
  time?: number | string
  toggleSidebar?: () => void
}

const Navbar = ({ username, time, toggleSidebar }: Props) => {
  const supabaseClient = useSupabaseClient()
  const [openSettings, setOpenSettings] = useState<Element | null>(null)
  const [previewProfile, setPreviewProfile] = useState<string>('')
  const [profileImage, setProfileImage] = useState(
    'https://i.ibb.co/mFg8pLH/c0c216b3743c6cb9fd67ab7df6b2c330.jpg'
  )

  // true if the screen width is less than 975px
  const isMobile = useMediaQuery('(max-width: 975px)')

  // profile picture input ref
  const pfpInputRef = useRef(null)

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
        <FullLogoIcon />
      </Link>
      <LogoIcon onClick={() => toggleSidebar && toggleSidebar()} />
      {/* show user status/username */}
      <UserInfo>{username && <Username>{username}</Username>}</UserInfo>
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
            <SettingsModal
              pfpInputRef={pfpInputRef}
              open={openSettings}
              onClose={closeSettings}
            />
            <Upload
              onChange={(event) => {
                handleProfileImage(event?.target?.files?.[0])
                return (event.currentTarget.value = '')
              }}
              ref={pfpInputRef}
              id="profileImage"
              type={'file'}
            />
            <ProfileImageContainer
              onClick={(e) => isMobile && handleOpenSettings(e)}
              htmlFor={isMobile ? '' : 'profileImage'}
            >
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
            <Name onClick={(e: any) => isMobile && handleOpenSettings(e)}>
              {user.username}
            </Name>
          </>
        )}
      </ProfileInfo>
    </Container>
  )
}

export default Navbar
