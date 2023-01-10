
import { Popover } from '@mui/material'

import styled from '@emotion/styled'
import Button from '@/components/Elements/Button'

export const Name = styled.p``

export const StyledButton = styled(Button)`
  background-color: transparent;
  justify-content: space-between;
  font-size: 1rem;
  padding: 0px;
  padding-right: 8px;
  transition: 400ms ease;

  &:hover {
    opacity: 0.5;
    background-color: transparent;
  }
`

export const Row = styled.div``

export const ChangePhoto = styled.p`
  &:hover {
    background-color: ${({ theme }) => theme.darkGrey}30;
    cursor: pointer;
  }
`

export const Container = styled.form`
  max-width: 300px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`

export const StyledPopover = styled(Popover)`
  .MuiPaper-root {
    margin-top: 20px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.lightBg};
    color: ${({ theme }) => theme.text};
  }
`
