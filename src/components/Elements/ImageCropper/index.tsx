import getCroppedImg from '@/helpers/copImage'
import { Slider } from '@mui/material'
import React, { useCallback, useState } from 'react'
import {
  BackgroundShadow,
  Container,
  StyledButton,
  StyledCropper,
  Wrap,
} from './ImageCropper.styles'

interface Props {
  image?: string
  open: boolean
  toggleCropper: () => void
}

export const ImageCropper: React.FC<Props> = ({
  image,
  open,
  toggleCropper,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const [croppedImage, setCroppedImage] = useState(null)

  const onCropComplete = useCallback(
    (
      croppedArea: any,
      croppedAreaPixels: { x: number; y: number; width: number; height: number }
    ) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      )
      console.log('donee', { croppedImage })
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation])

  return (
    <Container open={open}>
      <BackgroundShadow onClick={() => toggleCropper()} />
      <Wrap>
        <StyledCropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
        Zoom: {zoom - 1}%
        <Slider
          aria-label="Volume"
          value={zoom}
          max={101}
          onChange={(e, value) => value >= 1 && setZoom(Number(value))}
        />
        Rotation: {rotation}°
        <Slider
          aria-label="Volume"
          value={rotation}
          max={360}
          onChange={(e, value) => setRotation(Number(value))}
        />
        <StyledButton onClick={() => showCroppedImage()}>Save</StyledButton>
      </Wrap>
    </Container>
  )
}
