import { Modal, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import Button from '@/components/Button'
import ChatAnimation from '@/assets/animations/chat.json'
import ForgotPassModal from '@/components/ForgotPassModal'
import Google from '@/assets/icons/Google.svg'
import Image from 'next/image'
import { Input } from '@/components/Input'
import Layout from '@/Layout'
import Lottie from 'lottie-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'

const ForgotPassword = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const supabaseClient = createBrowserSupabaseClient()

  const handleAuth = async (data: any) => {
    const { password, confirmPassword } = data
    if (password !== confirmPassword) return
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      })
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

const ImageWrap = styled.div`
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.blue};
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 900px) {
    display: none;
  }
`

const StyledLottie = styled(Lottie)`
  max-width: 1000px;
  max-height: 1000px;
  cursor: copy !important;
  @media only screen and (max-width: 1700px) {
    max-width: 700px;
    max-height: 550px;
  }
`

const SignIn = styled(Button)`
  width: 100%;
  font-weight: 800;
  height: 45px;
  letter-spacing: 1px;
  border-radius: 5px;
`

const AuthButtons = styled.div``

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  @media only screen and (max-width: 400px) {
    .MuiFormControl-root,
    .MuiInputBase-root {
      min-width: 203px;
    }
  }
`

const Wrap = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 700px;
  padding: 1.5em 5em;
  border-radius: 15px;
  min-width: 363px;

  @media only screen and (max-width: 900px) {
    max-width: 350px;
    padding: 1.5em 2em;
    min-width: 253px;
  }
`

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
`

export default ForgotPassword
