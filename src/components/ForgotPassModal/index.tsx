import {
  CheckMarkLottie,
  Container,
  StyledButton,
  StyledInput,
  StyledModal,
} from './ForgotPassModal.styles'
import React, { useEffect, useState } from 'react'

import Mail from '@/assets/animations/mail.json'
import { Typography } from '@mui/material'
import { baseUrl } from '@/lib/axiosInstance'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useForm } from 'react-hook-form'

interface Props {
  children?: JSX.Element
  onClose: () => void
  open: boolean
}

const ForgotPassModal = ({ onClose, open }: Props) => {
  const [emailSent, setEmailSent] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const supabaseClient = createBrowserSupabaseClient()

  const handleForgotPass = async (data: any) => {
    const { email } = data
    setEmailSent(true)
    await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/forgot-password`,
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
            <Typography variant="h1" sx={{ fontSize: 28 }}>
              Forgot Password?
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: 350, textAlign: 'center', fontSize: 14, pt: 2 }}
            >
              Don’t worry! It happens. Please enter the email associated with
              your account.
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
              Please check the email address {watch('email')} for instructions
              to reset your password.
            </Typography>
            <StyledButton>Resend email</StyledButton>
          </>
        )}
      </Container>
    </StyledModal>
  )
}

export default ForgotPassModal
