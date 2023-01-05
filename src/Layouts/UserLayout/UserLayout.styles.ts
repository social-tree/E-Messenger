import styled from '@emotion/styled'

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
