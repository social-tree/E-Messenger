import { Modal, Popover } from '@mui/material'

import { ThemeType } from '@/global/theme'
import styled from '@emotion/styled'

export const Name = styled.p``

export const Row = styled.div``

export const Container = styled.form`
  max-width: 300px;
  padding: 20px;
`

export const StyledPopover = styled(Popover)`
  .MuiPaper-root {
    border-radius: 10px;
    background-color: ${({ theme }) => theme.lightBg};
    color: ${({ theme }) => theme.text};
  }
`
