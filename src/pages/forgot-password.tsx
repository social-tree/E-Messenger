import {
  AuthButtons,
  Container,
  ImageWrap,
  Inputs,
  SignIn,
  StyledLottie,
  Wrap,
} from '.'

import ChatAnimation from '@/assets/animations/chat.json'
import { Input } from '@/components/Elements/Input'
import { Typography } from '@mui/material'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { UserContext } from '@/context/UserContext'

const ForgotPassword = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm()
  const supabaseClient = createBrowserSupabaseClient()

  const router = useRouter()

  const { themeType, toggleTheme } = useContext(UserContext)

  const handleForgotPassword = async (data: any) => {
    const { password, confirmPassword } = data
    if (password !== confirmPassword)
      return setError('confirmPassword', {
        type: 'custom',
        message: `password mismatch`,
      })
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      })
      if (data) {
        throw router.push('/')
      }

      error?.message &&
        setError('confirmPassword', {
          type: 'custom',
          message: `${error.message}`,
        })
    } catch (error: any) {}
  }

  useEffect(() => {
    if (window && window?.location.hash) {
      const hashes = window.location.hash.split('&')
      const authType = hashes[hashes.length - 1]?.split('=')?.[1]
      authType !== 'recovery' && router.push('/')
    }
  }, [])

  useEffect(() => {
    if (themeType !== 'light') {
      toggleTheme(true)
    }
  }, [themeType])

  return (
    <Container>
      <Wrap onSubmit={handleSubmit(handleForgotPassword)}>
        <Typography
          variant="h1"
          sx={{
            fontSize: 30,
            fontFamily: 'Plus Jakarta Sans',
            textAlign: 'center',
            pb: 2,
            fontWeight: 900,
          }}
        >
          Reset Password
        </Typography>
        <Inputs>
          <Input
            label={'Password'}
            inputProps={{ type: 'password', placeholder: 'Password' }}
            {...register('password', {
              required: 'Please enter your Password',
            })}
            control={control}
            errors={errors}
          />
          <Input
            label={'Confirm Password'}
            placeholder="Confirm Password"
            inputProps={{ type: 'password', placeholder: 'Confirm Password' }}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
            })}
            control={control}
            errors={errors}
          />
        </Inputs>
        <AuthButtons>
          <SignIn type="submit">Submit</SignIn>
        </AuthButtons>
      </Wrap>
      <ImageWrap>
        <StyledLottie animationData={ChatAnimation} />
      </ImageWrap>
    </Container>
  )
}

export default ForgotPassword
