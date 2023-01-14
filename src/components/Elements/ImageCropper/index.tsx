import { UserContext } from '@/context/UserContext'
import getCroppedImg from '@/helpers/copImage'
import { Slider } from '@mui/material'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { decode } from 'base64-arraybuffer'
import React, { useCallback, useContext, useState } from 'react'
import {
  BackgroundShadow,
  Container,
  StyledButton,
  StyledCropper,
  StyledSlider,
  Wrap,
} from './ImageCropper.styles'

interface Props {
  image?: string
  toggleCropper: () => void
  afterCrop: (uploadedImage: string) => void
}

export const ImageCropper: React.FC<Props> = ({
  image,
  toggleCropper,
  afterCrop,
}) => {
  const { user } = useContext(UserContext)
  const supaBaseQuery = useSupabaseClient()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const [loading, setLoading] = useState(false)

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
      const croppedImage = (await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      )) as Blob
      setLoading(true)
      const { data } = await supaBaseQuery.storage
        .from('avatars')
        .upload(`${user?.id}/${user?.id}.png`, croppedImage, {
          contentType: 'image/png',
          upsert: true,
        })

      setLoading(false)
      if (data) afterCrop(data?.path)
      toggleCropper()
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation])

  return (
    <Container>
      <BackgroundShadow onClick={() => toggleCropper()} />
      <Wrap>
        <StyledCropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          maxZoom={100}
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
        <StyledSlider
          aria-label="Volume"
          value={rotation}
          max={360}
          onChange={(e, value) => setRotation(Number(value))}
        />
        <StyledButton loading={loading} onClick={() => showCroppedImage()}>
          Save
        </StyledButton>
      </Wrap>
    </Container>
  )
}
