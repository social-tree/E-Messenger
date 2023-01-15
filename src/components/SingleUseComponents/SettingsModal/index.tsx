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

interface Props {
  open: Element | null
  onClose: () => void
}

const SettingsModal = ({ open, onClose }: Props) => {
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
      </Container>
    </StyledPopover>
  )
}

export default SettingsModal
