import styled from '@emotion/styled'
import Button from '../Button'
import Cropper from 'react-easy-crop'
import { Slider } from '@mui/material'

export const StyledSlider = styled(Slider)`
  width: calc(100% - 10px);
  max-width: 100%;
`

export const StyledButton = styled(Button)`
  position: relative;
  color: white;
`

export const StyledCropper = styled(Cropper)``

export const Wrap = styled.div`
  position: relative;
  max-width: 500px;
  max-height: 600px;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 20px;
  margin: 0px 10px;
  background-color: ${({ theme }) => theme.lightBg};

  .reactEasyCrop_Container {
    position: relative;
    width: 100%;
    height: 100%;
  }
`

export const BackgroundShadow = styled.div`
  background-color: #00000060;
  width: 100%;
  height: 100%;
  position: fixed;
`

export const Container = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`
