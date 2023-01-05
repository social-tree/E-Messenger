import { Container, StyledPopover } from './SettingsModal.styles'

import React, { useContext, useEffect } from 'react'
import { Typography } from '@mui/material'
import { Switch } from '@/components/Elements/Switch'
import { useController, useForm, useWatch } from 'react-hook-form'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { UserContext } from '@/context/UserContext'

interface Props {
  open: Element | null
  onClose: () => void
}

const SettingsModal = ({ open, onClose }: Props) => {
  const { toggleTheme, themeType } = useContext(UserContext)
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: errors,
  } = useForm({
    mode: 'onBlur',
  })

  const handleThemeSubmit = () => {
    toggleTheme()
  }

  useEffect(() => {
    reset({ theme: themeType === 'light' ? false : true })
  }, [themeType])

  return (
    <StyledPopover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={!!open}
      anchorEl={open}
      onClose={onClose}
    >
      <Container>
        <Switch
          label={'Dark Mode'}
          errors={errors}
          control={control}
          onValueChange={() => handleThemeSubmit()}
          {...register('theme', { required: true })}
        />
      </Container>
    </StyledPopover>
  )
}

export default SettingsModal
