import styled from '@emotion/styled'

export const DateOfCreation = styled.p<{ myMessage: boolean }>`
  font-size: 10px;
  text-align: ${({ theme, myMessage }) => (myMessage ? `end` : `start`)};
  color: ${({ theme }) => theme.darkGrey};
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

export const Container = styled.div<{
  myMessage: boolean
  orderType: string
}>`
  display: flex;
  position: relative;
  left: ${({ orderType, myMessage }) =>
    (orderType === 'end' || orderType === 'first') && !myMessage
      ? '10px;'
      : !myMessage && '70px;'};
  right: ${({ myMessage }) => myMessage && '70px;'};
  align-items: flex-end;
  flex-direction: ${({ myMessage }) => (myMessage ? 'row-reverse' : 'row')};
  gap: 20px;
  align-self: ${({ myMessage }) => (myMessage ? 'flex-end' : 'flex-start')};
`
