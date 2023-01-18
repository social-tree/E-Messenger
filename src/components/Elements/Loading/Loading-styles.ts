import styled from '@emotion/styled'
import Lottie from 'lottie-react'

export const StyledLottie = styled(Lottie)`
  width: 200px;
  height: 200px;
`

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg};
`
