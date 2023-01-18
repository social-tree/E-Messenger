import LoadingButton from '@mui/lab/LoadingButton'
import styled from '@emotion/styled'

export const StyledButton = styled(LoadingButton)`
  min-width: 100px;
  background-color: ${({ theme }) => theme.blue};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  text-transform: none;
  &:hover {
    background-color: ${({ theme }) => theme.blue};
  }
`
