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
import {
  fetchUser,
  UpdateUserLastOnline,
  UpdateUserStatus,
} from '@/services/users'
import { imageUpdater } from '@/helpers/imageUpdater'

type UserContextType = {
  user?: UserType | null
  themeType: 'light' | 'dark'
  signOut: () => void
  handleAuth: handleAuthType
  snackbarMessage: string
  setSnackbarMessage: (message: string) => void
  toggleTheme: (local?: boolean) => void
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
    const {
      data: { subscription: authListener },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') router.push('/forgot-password')
      if (event === 'SIGNED_IN' && router.route === '/')
        router.push('/channels')
      if (!session) return
      const data = await fetchUser(session.user?.id, SupabaseQueries)
      setUser({
        ...session.user,
        ...data,
        avatar: data?.avatar ? imageUpdater(data?.avatar) : data?.avatar,
      })
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  useEffect(() => {
    supabaseClient.auth.getUser().then(async (res) => {
      if (!res.data?.user?.id) return
      const data = await fetchUser(res.data.user?.id, SupabaseQueries)
      setUser({
        ...res.data.user,
        ...data,
        avatar: data?.avatar ? imageUpdater(data?.avatar) : data?.avatar,
      })
    })
  }, [])

  useEffect(() => {
    user?.id && UpdateUserStatus(user?.id, 'ONLINE', SupabaseQueries)
  }, [user?.id])

  useEffect(() => {
    const Update = async () => {
      if (!user?.id) return
      UpdateUserLastOnline(user?.id, supabaseClient, 'OFFLINE')
      console.log('w')
    }

    window.addEventListener('beforeunload', Update)

    return () => {
      window.removeEventListener('beforeunload', Update)
    }
  }, [user?.id])

  const toggleTheme = async (local?: boolean) => {
    setThemeType((prev) => (prev === 'light' ? 'dark' : 'light'))
    if (user?.id && !local) {
      changeTheme(user?.id, themeType, SupabaseQueries)
    }
  }

  const handleAuth: handleAuthType = async (
    email,
    password,
    confirmPassword,
    username
  ) => {
    console.log({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    })
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
          options: {
            data: {
              username: username,
            },
          },
        })
        .then((response) => {
          console.log(response)
          response.data.user &&
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
        setThemeType(data?.user_settings?.theme || 'light')
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
