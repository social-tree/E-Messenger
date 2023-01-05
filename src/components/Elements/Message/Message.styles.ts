import styled from '@emotion/styled'

export const DateOfCreation = styled.p`
  font-size: 12px;
`

export const MessageText = styled.p<{ myMessage: boolean }>`
  padding: 16px;
  max-width: 400px;
  background-color: ${({ theme, myMessage }) =>
    myMessage ? `${theme.blue}50` : `${theme.grey}80`};
  border-radius: ${({ myMessage }) =>
    myMessage ? `16px 16px 0px 16px` : `16px 16px 16px 0px`};
`

export const Username = styled.p`
  color: ${({ theme }) => theme.green};
  font-weight: 500;
`

export const MessageWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const ProfileImage = styled.div`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  overflow: hidden;
`

export const Container = styled.div<{ myMessage: boolean }>`
  display: flex;
  align-items: flex-end;
  flex-direction: ${({ myMessage }) => (myMessage ? 'row-reverse' : 'row')};
  gap: 20px;
  align-self: ${({ myMessage }) => (myMessage ? 'flex-end' : 'flex-start')};
`
