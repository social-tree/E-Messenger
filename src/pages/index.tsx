import { Modal, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'

import Button from '@/components/Elements/Button'
import ChatAnimation from '@/assets/animations/chat.json'
import ForgotPassModal from '@/components/SingleUseComponents/ForgotPassModal'
import Google from '@/assets/icons/Google.svg'
import Image from 'next/image'
import { Input } from '@/components/Elements/Input'
import Layout from '@/Layouts/UserLayout'
import Lottie from 'lottie-react'
import { UserContext } from '@/context/UserContext'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

const Home = () => {
  const [authMode, setAuthMode] = useState('login')
  const {
    register,
    control,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const [showForgetPassword, setShowForgetPassword] = useState(false)
  const { handleAuth, themeType, toggleTheme } = useContext(UserContext)

  const handleClose = () => {
    setShowForgetPassword(false)
  }

  useEffect(() => {
    if (themeType !== 'light') {
      toggleTheme(true)
    }
  }, [themeType])

  const AuthSumbit = async (data: any) => {
    const { email, password, confirmPassword, username } = data
    try {
      const { error } = await handleAuth(
        email,
        password,
        confirmPassword && confirmPassword,
        username
      )

      error?.message &&
        setError('password', {
          type: 'custom',
          message: `${error.message}`,
        })
    } catch (error: any) {
      console.log('error', error)
    }
  }

  return (
    <Container>
      <ForgotPassModal onClose={handleClose} open={showForgetPassword} />
      <Wrap onSubmit={handleSubmit(AuthSumbit)}>
        <Inputs>
          {authMode !== 'login' && (
            <Input
              label={'Username'}
              placeholder="Username"
              inputProps={{ placeholder: 'Volxen' }}
              {...register('username', {
                required: 'Please enter your Username',
              })}
              control={control}
              errors={errors}
            />
          )}
          <Input
            label={'Email'}
            {...register('email', { required: 'Please enter your email' })}
            control={control}
            inputProps={{ placeholder: 'example@gmail.com' }}
            errors={errors}
          />
          <Input
            label={'Password'}
            inputProps={{ type: 'password', placeholder: 'Password' }}
            {...register('password', {
              required: 'Please enter your Password',
            })}
            control={control}
            errors={errors}
          />
          {authMode !== 'login' && (
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
          )}
          <Typography
            sx={{
              fontSize: 12,
              textAlign: 'right',
              color: '#b6b8b9e1',
              fontWeight: 600,
              letterSpacing: 0.5,
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            variant="subtitle1"
            onClick={() => setShowForgetPassword(true)}
          >
            Forgot Password?
          </Typography>
        </Inputs>
        <AuthButtons>
          <SignIn type="submit">
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </SignIn>
        </AuthButtons>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#b9b8b889',
            ':before': {
              content: '""',
              width: '45%',
              backgroundColor: 'grey',
              opacity: 0.7,
              height: '1px',
            },
            ':after': {
              content: '""',
              width: '45%',
              backgroundColor: 'grey',
              opacity: 0.7,
              height: '1px',
            },
          }}
          variant="subtitle1"
        >
          or
        </Typography>
        <SocialButtons>
          <SocialButton>
            <Google />
          </SocialButton>
        </SocialButtons>
        <Typography
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 0.5,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: '600',
            fontFamily: 'inherit',
          }}
        >
          {authMode === 'login'
            ? 'Dont have an account ?'
            : 'Already have an account ?'}
          <SignUp
            onClick={() =>
              setAuthMode((prev) => (prev === 'login' ? 'signup' : 'login'))
            }
          >
            {authMode === 'login' ? 'Sign up' : 'Login'}
          </SignUp>
        </Typography>
      </Wrap>
      <ImageWrap>
        <StyledLottie
          loop={!showForgetPassword}
          animationData={ChatAnimation}
        />
      </ImageWrap>
    </Container>
  )
}

export const SignUp = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.blue};

  &:hover {
    cursor: pointer;
  }
`

export const ImageWrap = styled.div`
  width: 100%;
  height: 100vh;
  background: #4f81a3;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 900px) {
    display: none;
  }
`

export const StyledLottie = styled(Lottie)`
  max-width: 1000px;
  max-height: 1000px;
  svg {
    cursor: default !important;
  }
  @media only screen and (max-width: 1700px) {
    max-width: 700px;
    max-height: 550px;
  }
`

export const SocialButton = styled(Button)`
  background-color: white;
  box-shadow: 0px 5px 18px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  width: 100%;
  height: 45px;
  &:hover {
    background-color: transparent;
    border: none;
    box-shadow: none;
    border: 2px solid ${({ theme }) => `${theme.grey}60`};
  }
`

export const SocialButtons = styled.div`
  display: flex;
  gap: 5px;
`

export const SignIn = styled(Button)`
  width: 100%;
  font-weight: 800;
  color: white;
  height: 45px;
  letter-spacing: 1px;
  box-shadow: 0px 5px 18px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  &:hover {
    box-shadow: none;
  }
`

export const AuthButtons = styled.div``

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  .MuiInputBase-root {
    background-color: #ffffff;
  }

  .MuiInputBase-input {
    ::placeholder {
      color: black;
    }
  }

  @media only screen and (max-width: 400px) {
    .MuiFormControl-root,
    .MuiInputBase-root {
      min-width: 203px;
    }
  }
`

export const Wrap = styled.form`
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
    background: ${({ theme }) => theme.bg};
  }
`

export const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 900px) {
    background: ${({ theme }) => theme.darkBlue};
  }
`

export default Home
