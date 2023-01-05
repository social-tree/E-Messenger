import styled from '@emotion/styled'
import Button from '../Button'
import { Input } from '../Input'

export const StyledInput = styled(Input)`
  .MuiFormControl-root {
    height: 48px;
  }
  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
  background-color: ${({ theme }) => theme.lightBg}50;
`

export const StyledButton = styled(Button)`
  margin-left: auto;
  background-color: transparent;
  padding: 4px 0px 2px 0px;
  min-width: 60px;
  color: #9e9e9e;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.grey};

  &:hover {
    background-color: transparent;
  }
`

export const Additional = styled.div`
  padding: 10px 25px;
  display: flex;
  gap: 20px;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.grey};
  background-color: ${({ theme }) => theme.lightBg};
`

export const Container = styled.form`
  border: 1px solid ${({ theme }) => theme.grey};
  max-width: 520px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  align-self: center;
  margin-top: auto;
`
