import Button from '../../Elements/Button'
import { Input } from '../../Elements/Input'
import Lottie from 'lottie-react'
import { Modal } from '@mui/material'
import styled from '@emotion/styled'

export const StyledInput = styled(Input)`
  margin-top: 20px;
  width: 100%;
  min-width: 100%;
  .MuiFormControl-root {
    width: 100%;
  }
`

export const StyledButton = styled(Button)`
  margin-top: 10px;
  width: 100%;
  border-radius: 8px;
  height: 45px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.blue};
  color: ${({ theme }) => theme.blue};
  font-size: 16px;
  font-weight: 900;

  &:hover {
    color: ${({ theme }) => theme.bg};
  }
`

export const CheckMarkLottie = styled(Lottie)`
  width: 100px;
  height: 90px;
`

export const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 250px;
  padding: 20px;
  border-radius: 5px;
  background-color: white;

  &:focus-visible {
    outline: none !important;
  }
`

export const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`
