import styled from '@emotion/styled'

export const DateOfCreation = styled.p<{ myMessage: boolean }>`
  font-size: 10px;
  text-align: ${({ theme, myMessage }) => (myMessage ? `end` : `start`)};
  color: ${({ theme }) => theme.darkGrey};
`

export const MessageText = styled.p<{ myMessage: boolean; orderType: string }>`
  padding: 16px;
  max-width: 400px;
  white-space: pre-wrap;
  word-break: break-all;
  background-color: ${({ theme, myMessage }) =>
    myMessage ? `${theme.blue}50` : `${theme.grey}80`};
  border-radius: ${({ myMessage, orderType }) =>
    orderType === 'start' && !myMessage
      ? `25px 16px 16px 9px`
      : orderType === 'start' && myMessage
      ? `16px 25px 9px 16px`
      : orderType !== 'end' && !myMessage
      ? `9px 16px 16px 9px`
      : orderType !== 'end' && myMessage
      ? `16px 9px 9px 16px`
      : orderType === 'end' && !myMessage
      ? `9px 16px 16px 0px`
      : `16px 9px 0px 16px`};

  @media only screen and (max-width: 500px) {
    max-width: 300px;
  }

  @media only screen and (max-width: 360px) {
    max-width: 200px;
  }
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
  @media only screen and (max-width: 975px) {
    width: 35px;
    height: 35px;
  }

  @media only screen and (max-width: 400px) {
    width: 23px;
    height: 23px;
  }
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

  @media only screen and (max-width: 975px) {
    left: ${({ orderType, myMessage }) =>
      (orderType === 'end' || orderType === 'first') && !myMessage
        ? ' 0px;'
        : !myMessage && '45px;'};
    right: ${({ myMessage }) => myMessage && '45px;'};
    gap: 10px;
  }

  @media only screen and (max-width: 570px) {
    gap: 10px;
  }

  @media only screen and (max-width: 400px) {
    left: ${({ orderType, myMessage }) =>
      (orderType === 'end' || orderType === 'first') && !myMessage
        ? ' 0px;'
        : !myMessage && '30px;'};
    right: ${({ myMessage }) => myMessage && '10px;'};
    gap: 5px;
  }
`
