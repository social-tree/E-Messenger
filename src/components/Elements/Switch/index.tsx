import { FormControl, FormControlProps, InputProps } from '@mui/material'
import React from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { Container, Error, Label, StyledSwitch } from './Switch.styles'

interface Props extends FormControlProps {
  name: string
  label?: React.ReactNode
  control?: Control<FieldValues> | undefined
  defaultValue?: string
  defaultChecked?: boolean
  inputProps?: InputProps
  onValueChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void
  errors: any
}

export const Switch = ({
  label,
  inputProps,
  className,
  control,
  name,
  onValueChange,
  errors,
  defaultValue,
  ...props
}: Props) => {
  return (
    <Container className={className}>
      <Label htmlFor={`switch-${name}`}>{label}</Label>
      <FormControl {...props}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledSwitch
              onChange={(event, value) => {
                onChange(event, value)
                onValueChange && onValueChange(event, value)
              }}
              inputProps={{ id: `switch-${name}` }}
              onBlur={onBlur}
              checked={value}
            />
          )}
        />
      </FormControl>
    </Container>
  )
}
