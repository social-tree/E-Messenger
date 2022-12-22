import { Container, Error, Label, StyledTextField } from './Input.styles'
import { Control, FieldValues } from 'react-hook-form/dist/types'
import {
  FormControl,
  FormControlProps,
  IconButton,
  InputAdornment,
  InputProps,
} from '@mui/material'

import ClosedEye from '@/assets/icons/closedEye.svg'
import { Controller } from 'react-hook-form'
import Eye from '@/assets/icons/eye.svg'
import { FieldErrorsImpl } from 'react-hook-form/dist/types/errors'
import { useState } from 'react'

interface Props extends FormControlProps {
  name: string
  label?: React.ReactNode
  control?: Control<FieldValues> | undefined
  defaultValue?: string
  inputProps?: InputProps
  errors: any
}

export const Input = ({
  label,
  inputProps,
  className,
  control,
  name,
  errors,
  defaultValue,
  ...props
}: Props) => {
  const [inputType, setInputType] = useState(
    inputProps && inputProps.type ? inputProps.type : 'text'
  )

  function showPassword() {
    if (inputType !== 'text') {
      setInputType('text')
    } else {
      setInputType('password')
    }
  }
  return (
    <Container className={className}>
      <Label>{label}</Label>
      <FormControl {...props}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextField
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              InputProps={{
                ...inputProps,
                type: inputType,
                endAdornment: inputProps && inputProps.type === 'password' && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={showPassword}
                    >
                      {inputType === 'password' ? <ClosedEye /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </FormControl>
      <Error>{errors?.[name]?.message}</Error>
    </Container>
  )
}
