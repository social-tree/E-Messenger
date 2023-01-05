import Image from 'next/image'
import Logo from '@/assets/icons/Logo.svg'
import Menu from '@/assets/icons/MenuDots.svg'
import Settings from '@/assets/icons/Settings.svg'
import styled from '@emotion/styled'

export const Lastseen = styled.p``

export const Username = styled.p`
  font-weight: 900;
`

export const UserInfo = styled.div`
  display: flex;
  gap: 5px;
  margin-left: 137px;
  max-width: 100%;
  width: 100%;
`

export const MenuIcon = styled(Menu)`
  &:hover {
    cursor: pointer;
  }
`

export const SettingsIcon = styled(Settings)`
  min-width: 24px;
  height: 24px;
  &:hover {
    cursor: pointer;
  }
`

export const LogoIcon = styled(Logo)`
  min-width: 159px;
  height: 56px;
  &:hover {
    cursor: pointer;
  }
`

export const ProfileImage = styled.div`
  min-height: 24px !important;
  min-width: 24px !important;
  border-radius: 50%;
  overflow: hidden;
  &:hover {
    cursor: pointer;
  }
`

export const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

export const Container = styled.nav<{ openSettings: boolean }>`
  box-shadow: 0px 1px 2px rgba(2, 17, 37, 0.12);
  padding: 0px 24px;
  display: flex;
  align-items: center;
`
