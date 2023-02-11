import {
  CheckMarkLottie,
  Container,
  StyledButton,
  StyledInput,
  StyledModal,
} from './OtpLoginModal'
import React, { useState } from 'react'
import { useSessionContext } from '@supabase/auth-helpers-react'

import Mail from '@/assets/animations/mail.json'
import { Typography } from '@mui/material'
import { baseUrl } from '@/lib/axiosInstance'
import { useForm } from 'react-hook-form'

interface Props {
  children?: JSX.Element
  onClose: () => void
  open: boolean
}

const OtpLoginModal = ({ onClose, open }: Props) => {
  const [emailSent, setEmailSent] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const { supabaseClient } = useSessionContext()

  // send the reset password email
  const handleForgotPass = async (data: any) => {
    const { email } = data
    setEmailSent(true)
    await supabaseClient.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${baseUrl}channels`,
      },
    })
  }

  return (
    <StyledModal
      onAbort={() => setEmailSent(false)}
      onClose={() => {
        onClose()
        setEmailSent(false)
        reset({})
      }}
      open={open}
    >
      <Container onSubmit={handleSubmit(handleForgotPass)}>
        {!emailSent ? (
          <>
            <Typography variant="h1" sx={{ fontSize: 28, fontWeight: 600 }}>
              Quick Login
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                maxWidth: 350,
                textAlign: 'center',
                fontSize: 14,
                pt: 2,
              }}
            >
              Quick login with just your email.
            </Typography>
            <StyledInput
              errors={errors}
              {...register('email', { required: 'Please enter your email' })}
              control={control}
              inputProps={{ placeholder: 'Email', type: 'email' }}
            />
            <StyledButton type="submit">Submit</StyledButton>
          </>
        ) : (
          <>
            <CheckMarkLottie animationData={Mail} />
            <Typography sx={{ fontSize: 22 }}>Check Your Email</Typography>
            <Typography
              sx={{ maxWidth: 350, textAlign: 'center', pt: 2, fontSize: 14 }}
            >
              Please check the email address {watch('email')} to confirm your
              email and login
            </Typography>
            <StyledButton type="submit">Resend email</StyledButton>
          </>
        )}
      </Container>
    </StyledModal>
  )
}

export default OtpLoginModal
