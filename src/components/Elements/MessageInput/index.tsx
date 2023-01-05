import { KeyboardEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Container,
  StyledButton,
  StyledInput,
  Additional,
} from './MessageInput.styles'
import Microphone from '@/assets/icons/microphone.svg'
import Clip from '@/assets/icons/clip.svg'
import Button from '../Button'
interface Props {
  onSubmit: (text: string) => void
}

const MessageInput = ({ onSubmit }: Props) => {
  const {
    register,
    control,
    formState: errors,
    handleSubmit,
    reset,
  } = useForm()

  const handleFormSubmit = (data: { message?: string }) => {
    if (data.message) {
      onSubmit(data?.message)
      reset({ message: '' })
    }
  }

  return (
    <Container onSubmit={handleSubmit(handleFormSubmit)}>
      <StyledInput
        {...register('message', {
          required: 'Write a message',
        })}
        inputProps={{ placeholder: 'Write a message...' }}
        errors={errors}
        control={control}
      />
      <Additional>
        <Microphone />
        <Clip />
        <StyledButton type="submit">Send</StyledButton>
      </Additional>
    </Container>
  )
}

export default MessageInput
