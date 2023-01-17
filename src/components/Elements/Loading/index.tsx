import Lottie from 'lottie-react'
import React from 'react'
import { Container, StyledLottie } from './Loading-styles'
import LoadingAnimation from '@/assets/animations/loading.json'

export const Loading = () => {
  return (
    <Container>
      <StyledLottie animationData={LoadingAnimation} />
    </Container>
  )
}
