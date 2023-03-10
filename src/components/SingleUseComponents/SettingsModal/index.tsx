import {
  ChangePhoto,
  Container,
  StyledButton,
  StyledPopover,
} from './SettingsModal.styles'

import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { UserContext } from '@/context/UserContext'
import { Switch } from '@/components/Elements/Switch'
import LogoutSVG from '@/assets/icons/logout.svg'
import CameraSVG from '@/assets/icons/camera.svg'

interface Props {
  open: Element | null
  onClose: () => void
  pfpInputRef: React.RefObject<HTMLInputElement>
}

const SettingsModal = ({ open, onClose, pfpInputRef }: Props) => {
  const { toggleTheme, themeType, signOut } = useContext(UserContext)
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: errors,
  } = useForm({
    mode: 'onBlur',
  })

  // toggle the theme on click
  const handleThemeSubmit = () => {
    toggleTheme()
  }

  // change the checkbox staus based on settings
  useEffect(() => {
    reset({ theme: themeType === 'light' ? false : true })
  }, [themeType])

  return (
    <StyledPopover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
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
        <StyledButton onClick={() => signOut()}>
          Logout <LogoutSVG width={20} />
        </StyledButton>
        <StyledButton onClick={() => pfpInputRef?.current?.click()}>
          Change Photo <CameraSVG width={20} />
        </StyledButton>
      </Container>
    </StyledPopover>
  )
}

export default SettingsModal
