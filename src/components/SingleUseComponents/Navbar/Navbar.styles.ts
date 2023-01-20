import Image from 'next/image'
import FullLogo from '@/assets/icons/FullLogo.svg'
import Logo from '@/assets/icons/Logo.svg'
import Menu from '@/assets/icons/MenuDots.svg'
import Settings from '@/assets/icons/Settings.svg'
import styled from '@emotion/styled'
import CameraSVG from '@/assets/icons/camera.svg'
import Sidebar from '../Sidebar'

export const StyledSidebar = styled(Sidebar)``

export const Upload = styled.input`
  display: none;
`

export const StyledCameraSVG = styled(CameraSVG)`
  position: absolute;
  width: 15px;
  bottom: -15px;
  z-index: 10000;
  transition: 300ms ease;
  color: white;
`

export const Lastseen = styled.p`
  @media only screen and (max-width: 450px) {
    font-size: 15px;
  }
  @media only screen and (max-width: 352px) {
    font-size: 13px;
  }
`

export const Username = styled.p`
  font-weight: 900;
  @media only screen and (max-width: 450px) {
    font-size: 15px;
  }
  @media only screen and (max-width: 352px) {
    font-size: 13px;
  }
`

export const UserInfo = styled.div`
  display: flex;
  gap: 5px;
  margin-left: 137px;
  max-width: 100%;
  width: 100%;
  @media only screen and (max-width: 975px) {
    width: max-content;
    margin-left: 0px;
  }

  @media only screen and (max-width: 570px) {
    margin-left: 10px;
  }
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

  @media only screen and (max-width: 975px) {
    display: none;
  }
`

export const FullLogoIcon = styled(FullLogo)`
  min-width: 159px;
  height: 56px;
  &:hover {
    cursor: pointer;
  }
  @media only screen and (max-width: 975px) {
    display: none;
  }
`

export const LogoIcon = styled(Logo)`
  min-width: 32px;
  height: 32px;
  display: none;
  margin-right: 25px;
  &:hover {
    cursor: pointer;
  }
  @media only screen and (max-width: 975px) {
    display: block;
  }
  @media only screen and (max-width: 570px) {
    margin-right: 0px;
  }
  @media only screen and (max-width: 450px) {
    min-width: 25px;
    height: 25px;
  }
`

export const Name = styled.span`
  @media only screen and (max-width: 450px) {
    display: none;
  }
`

export const StyledImage = styled(Image)`
  height: 32px !important;
  width: 32px !important;
  position: absolute;

  @media only screen and (max-width: 450px) {
    width: 25px !important;
    height: 25px !important;
  }
`

export const ProfileImageContainer = styled.label`
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  height: 32px !important;
  width: 32px !important;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-left: 10px;

  &::after {
    content: '';
    position: absolute;
    background-color: ${({ theme }) => theme.darkGrey};
    width: 100%;
    height: 14px;
    bottom: -20px;
    transition: 300ms ease;
  }

  &:hover {
    &::after {
      bottom: 0;
    }

    svg {
      bottom: 0;
    }
    cursor: pointer;
  }

  @media only screen and (max-width: 450px) {
    &::after {
      display: none;
    }
    svg {
      display: none;
    }
  }
`

export const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const Container = styled.nav<{ openSettings: boolean }>`
  box-shadow: 0px 1px 2px rgba(2, 17, 37, 0.12);
  padding: 0px 24px;
  min-height: 56px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.lightBg};
  @media only screen and (max-width: 975px) {
    justify-content: space-between;
  }
  @media only screen and (max-width: 570px) {
    padding: 0px 9px;
  }
`
