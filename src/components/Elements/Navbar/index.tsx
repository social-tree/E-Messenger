import {
  Container,
  Lastseen,
  LogoIcon,
  ProfileImage,
  ProfileInfo,
  SettingsIcon,
  UserInfo,
  Username,
} from './Navbar.styles'
import { useContext, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import SettingsModal from '../SettingsModal'
import { UserContext } from '@/context/UserContext'

interface Props {
  username?: string
  time?: string
}

const Navbar = ({ username, time }: Props) => {
  const [openSettings, setOpenSettings] = useState<Element | null>(null)
  const { user, signOut } = useContext(UserContext)
  const closeSettings = () => {
    setOpenSettings(null)
  }

  const handleOpenSettings = (event: React.MouseEvent<Element>) => {
    setOpenSettings(event.currentTarget)
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
            <SettingsIcon onClick={(e: any) => handleOpenSettings(e)} />
            <SettingsModal open={openSettings} onClose={closeSettings} />
            <ProfileImage onClick={() => signOut()}>
              <Image
                src="https://i.pinimg.com/originals/c0/c2/16/c0c216b3743c6cb9fd67ab7df6b2c330.jpg"
                width={52}
                height={52}
                layout="responsive"
                alt="profile"
              />
            </ProfileImage>
          </>
        )}
      </ProfileInfo>
    </Container>
  )
}

export default Navbar
