import { AuthResponse, User } from '@supabase/supabase-js'
import {
  Context,
  ContextType,
  Validator,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import Message from '@/components/Elements/Message'
import { fetchUserRoles } from '@/services/users'
import { handleAuthType } from '@/types/auth'
import { useRouter } from 'next/router'
import { useSessionContext } from '@supabase/auth-helpers-react'
import { userRolesType } from '@/types/user_roles'

type UserContextType = {
  user?: User | null
  signOut: () => void
  handleAuth: handleAuthType
  snackbarMessage: string
  setSnackbarMessage: (message: string) => void
}

export const UserContext = createContext<UserContextType>({
  user: undefined,
  signOut: () => {},
  handleAuth: async () => ({
    data: {
      user: null,
      session: null,
    },
    error: null,
  }),
  snackbarMessage: '',
  setSnackbarMessage: () => {},
})

interface Props {
  children: JSX.Element | JSX.Element[]
}

const UserProvider = ({ children }: Props) => {
  const { supabaseClient } = useSessionContext()
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabaseClient.auth.getUser().then((res) => setUser(res.data.user))
  }, [])

  const handleAuth = async (
    email: string,
    password: string,
    confirmPassword?: string
  ) => {
    if (confirmPassword) {
      if (confirmPassword !== password)
        return {
          data: { user: null, session: null },
          error: { message: 'password mismatch' },
        }

      return await supabaseClient.auth
        .signUp({
          email,
          password,
        })
        .then((response) => {
          setSnackbarMessage(
            'Your account has been created. Please check your email to confirm your account.'
          )

          return response
        })
    } else {
      return await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
    }
  }

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut()
    if (!error) {
      router.push('/')
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        handleAuth,
        signOut,
        snackbarMessage,
        setSnackbarMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
