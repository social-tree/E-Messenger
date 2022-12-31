import {
  AuthButtons,
  Container,
  ImageWrap,
  Inputs,
  SignIn,
  StyledLottie,
  Wrap,
} from '.'
import { useEffect, useState } from 'react'

import ChatAnimation from '@/assets/animations/chat.json'
import { Input } from '@/components/Elements/Input'
import { Typography } from '@mui/material'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

const ForgotPassword = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const supabaseClient = createBrowserSupabaseClient()

  const router = useRouter()

  const handleAuth = async (data: any) => {
    const { password, confirmPassword } = data
    if (password !== confirmPassword) return
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      })
      if (data) {
        throw router.push('/')
      }
    } catch (error: any) {}
  }

  useEffect(() => {
    const {
      data: { subscription: authListener },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log(event, session, 'W')
    })
    return () => {
      authListener.unsubscribe()
    }
  }, [])

  return (
    <Container>
      <Wrap onSubmit={handleSubmit(handleAuth)}>
        <Typography
          variant="h1"
          sx={{ fontSize: 30, textAlign: 'center', pb: 2, fontWeight: 900 }}
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
