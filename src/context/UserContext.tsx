import { User } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from 'react'

import { handleAuthType } from '@/types/auth'
import { useRouter } from 'next/router'
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react'
import { theme } from '@/global/theme'
import { ThemeProvider } from '@emotion/react'
import { debounce } from '@/helpers/debounce'
import { changeTheme, fetchSettings } from '@/services/settings'
import { UserType } from '@/types/users'

type UserContextType = {
  user?: UserType | null
  themeType: 'light' | 'dark'
  signOut: () => void
  handleAuth: handleAuthType
  snackbarMessage: string
  setSnackbarMessage: (message: string) => void
  toggleTheme: () => void
}

export const UserContext = createContext<UserContextType>({
  user: undefined,
  themeType: 'light',
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
  toggleTheme: () => {},
})

interface Props {
  children: JSX.Element | JSX.Element[]
}

const UserProvider = ({ children }: Props) => {
  const { supabaseClient } = useSessionContext()
  const SupabaseQueries = useSupabaseClient()
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [user, setUser] = useState<UserType | null>(null)
  const [themeType, setThemeType] = useState<'light' | 'dark'>('light')
  const router = useRouter()

  useEffect(() => {
    supabaseClient.auth.getUser().then(async (res) => {
      const { data } = await SupabaseQueries.from('users')
        .select('*')
        .eq('id', res.data.user?.id)
        .single()
      setUser({ ...res.data.user, ...data })
    })
  }, [])

  const toggleTheme = async () => {
    setThemeType((prev) => (prev === 'light' ? 'dark' : 'light'))
    if (user?.id) {
      changeTheme(user?.id, themeType, SupabaseQueries)
    }
  }

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

  useEffect(() => {
    if (user?.id) {
      fetchSettings(user.id, SupabaseQueries).then((data) => {
        console.log(data)
        setThemeType(data?.user_settings.theme)
      })
    }
  }, [user])

  return (
    <UserContext.Provider
      value={{
        user,
        handleAuth,
        signOut,
        snackbarMessage,
        setSnackbarMessage,
        themeType,
        toggleTheme,
      }}
    >
      <ThemeProvider theme={theme[themeType]}>{children}</ThemeProvider>
    </UserContext.Provider>
  )
}

export default UserProvider
