import Sidebar from '@/components/SingleUseComponents/Sidebar'
import styled from '@emotion/styled'
import { keyframes } from '@mui/material'

const fadeIn = keyframes`
0% {
  opacity: 0;
}

100% {
  opacity: 1; 
}
`

export const ShadowOverlay = styled.div<{ showSidebar: boolean }>`
  @media only screen and (max-width: 975px) {
    display: ${({ showSidebar }) => (showSidebar ? 'flex' : 'none')};
    background-color: ${({ showSidebar }) => (showSidebar ? '#00000090' : '')};
    opacity: ${({ showSidebar }) => (showSidebar ? '1' : '0')};
    position: absolute;
    top: 56px;
    left: 0px;
    width: 100%;
    height: calc(100% - 56px);
    z-index: 20;
    animation: ${fadeIn} 300ms ease;
  }
`

export const StyledSidebar = styled(Sidebar)<{ showSidebar: boolean }>`
  @media only screen and (max-width: 975px) {
    position: absolute;
    height: calc(100% - 56px);
    top: 56px;
    left: 0;
    z-index: 99;
    transform: translateX(
      ${({ showSidebar }) => (showSidebar ? '0%' : '-300%')}
    );
    transition: 300ms ease;
  }
`

export const UserMessages = styled.div`
  width: 100%;
`

export const Wrap = styled.div`
  display: flex;
  height: calc(100vh - 56px);
`

export const Container = styled.main`
  height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`
