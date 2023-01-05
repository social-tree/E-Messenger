import styled from '@emotion/styled'
import Link from 'next/link'

export const LastMessage = styled.p`
  color: ${({ theme }) => theme.text};
  height: 40px;
  max-width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const Name = styled.p`
  font-weight: 900;
`

export const ProfileImage = styled.div`
  min-width: 33px;
  height: 33px;
  overflow: hidden;
  border-radius: 50%;
`

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  height: 40px;
  width: 100%;
  font-size: 14px;
  justify-content: space-between;
`

export const DateOfCreation = styled.p`
  color: ${({ theme }) => theme.darkGrey};
  font-size: 12px;
`

export const Top = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`

export const StyledLink = styled(Link)`
  min-width: 320px;
  min-height: 60px;
`

export const Container = styled.li<{ isActiveChannel: boolean }>`
  display: flex;
  align-items: center;
  height: 60px;
  gap: 10px;
  padding: 0px 20px;
  width: 100%;
  background-color: ${({ theme, isActiveChannel }) =>
    isActiveChannel && `${theme.grey}40`};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:hover {
    cursor: pointer;
  }
`
