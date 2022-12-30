import { Modal, Typography } from '@mui/material'

import Button from '@/components/Button'
import ChatAnimation from '@/assets/animations/chat.json'
import ForgotPassModal from '@/components/ForgotPassModal'
import Google from '@/assets/icons/Google.svg'
import Image from 'next/image'
import { Input } from '@/components/Input'
import Layout from '@/Layout'
import Lottie from 'lottie-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Home = () => {
  const [authMode, setAuthMode] = useState('login')
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const [showForgetPassword, setShowForgetPassword] = useState(false)
  const router = useRouter()

  const handleClose = () => {
    setShowForgetPassword(false)
  }

  const handleAuth = async (data: any) => {
    const { email, password, confirmPassword } = data
    const supabaseClient = createBrowserSupabaseClient()
    try {
      const {
        error,
        data: { user },
      } =
        authMode === 'login'
          ? await supabaseClient.auth
              .signInWithPassword({
                email,
                password,
              })
              .then((res) => {
                router.push('/channels/1')
                return res
              })
          : password === confirmPassword
          ? await supabaseClient.auth.signUp({ email, password })
          : {
              error: { message: 'Password does not match' },
              data: { user: null },
            }
      if (error) {
        alert('Error with auth: ' + error.message)
      } else if (!user)
        alert('Signup successful, confirmation mail should be sent soon!')
    } catch (error: any) {
      console.log('error', error)
      alert(error.error_description || error)
    }
  }

  return (
    <Container>
      <ForgotPassModal onClose={handleClose} open={showForgetPassword} />
      <Wrap onSubmit={handleSubmit(handleAuth)}>
        <Inputs>
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

const SignUp = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.blue};

  &:hover {
    cursor: pointer;
  }
`

const ImageWrap = styled.div`
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

const StyledLottie = styled(Lottie)`
  max-width: 1000px;
  max-height: 1000px;
  cursor: copy !important;
  @media only screen and (max-width: 1700px) {
    max-width: 700px;
    max-height: 550px;
  }
`

const SocialButton = styled(Button)`
  background-color: white;
  border: 2px solid ${({ theme }) => `${theme.grey}60`};
  border-radius: 8px;
  width: 100%;
  height: 45px;

  &:hover {
    background-color: transparent;
    border: none;
    box-shadow: 0px 5px 18px rgba(0, 0, 0, 0.15);
  }
`

const SocialButtons = styled.div`
  display: flex;
  gap: 5px;
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

export default Home
