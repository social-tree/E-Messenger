import { TextField } from '@mui/material'
import styled from '@emotion/styled'

export const Error = styled.p`
  font-size: 13px;
  color: red;
`

export const StyledTextField = styled(TextField)`
  min-width: 280px;
  height: 50px;
  .MuiInputBase-root {
    color: ${({ theme }) => theme.text};
    min-width: 280px;
    height: 45px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.bg};
  }
  .MuiInputBase-input {
    padding: 10px 14px !important;
    ::placeholder {
      font-size: 14px;
      color: ${({ theme }) => theme.text};
      opacity: 0.6;
    }
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.text};
  }
`

export const Label = styled.label`
  font-size: 15px;
  font-weight: 500;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
