import styled from '@emotion/styled'
import { Switch } from '@mui/material'

export const StyledSwitch = styled(Switch)`
  padding: 8px;
  .MuiSwitch-track {
    border-radius: 11px;
    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
    }
  }
  .MuiSwitch-thumb {
    box-shadow: none;
    width: 16px;
    height: 16px;
    margin: 2px;
  }
`

export const Label = styled.div``

export const Error = styled.p``

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
`
