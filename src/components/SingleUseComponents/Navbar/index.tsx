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
import { useContext, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import SettingsModal from '../SettingsModal'
import { UserContext } from '@/context/UserContext'
import { ImageCropper } from '@/components/Elements/ImageCropper'

interface Props {
  username?: string
  time?: number | string
}

const Navbar = ({ username, time }: Props) => {
  const [openSettings, setOpenSettings] = useState<Element | null>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewProfile, setPreviewProfile] = useState<string | undefined>(
    undefined
  )

  const { user } = useContext(UserContext)
  const closeSettings = () => {
    setOpenSettings(null)
  }

  const handleOpenSettings = (event: React.MouseEvent<Element>) => {
    setOpenSettings(event.currentTarget)
  }

  const handleProfileImage = (file?: File) => {
    if (!file) return
    setProfileImage(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') return
      setPreviewProfile(reader.result)
    }
    reader.readAsDataURL(file)
  }

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
            <ImageCropper
              open={profileImage ? true : false}
              toggleCropper={handleProfileImage}
              image={previewProfile}
            />
            <SettingsIcon onClick={(e: any) => handleOpenSettings(e)} />
            <SettingsModal open={openSettings} onClose={closeSettings} />
            <Upload
              onChange={(event) => {
                console.log('W')
                handleProfileImage(event?.target?.files?.[0])
              }}
              id="profileImage"
              type={'file'}
            />
            <ProfileImageContainer htmlFor="profileImage">
              <StyledImage
                src="https://i.pinimg.com/originals/c0/c2/16/c0c216b3743c6cb9fd67ab7df6b2c330.jpg"
                width={52}
                height={52}
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
