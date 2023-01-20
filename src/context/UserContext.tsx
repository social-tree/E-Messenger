import { OAuthResponse, Provider, User } from '@supabase/supabase-js'
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
import { baseUrl } from '@/lib/axiosInstance'

type UserContextType = {
  user?: UserType | null
  themeType: 'light' | 'dark'
  signOut: () => void
  handleAuth: handleAuthType
  handleOAuth: (provider: Provider) => Promise<OAuthResponse>
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
  handleOAuth: async () => ({
    data: {
      provider: 'google',
      url: '',
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
  // notification message state
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [user, setUser] = useState<UserType | null>(null)
  const [themeType, setThemeType] = useState<'light' | 'dark'>('light')
  const router = useRouter()

  // fetch user Information on their authentication state change
  useEffect(() => {
    const {
      data: { subscription: authListener },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') router.push('/forgot-password')
      if (event === 'SIGNED_IN' && router.route === '/')
        router.push('/channels')
      if (!session) return
      // fetch user Information with metadata / settings
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

  // fetch user on page load
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

  // update user status to online on page load
  useEffect(() => {
    user?.id && UpdateUserStatus(user?.id, 'ONLINE', SupabaseQueries)
  }, [user?.id])

  // update user status to offline on page unload
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

  // change user theme settings
  const toggleTheme = async (local?: boolean) => {
    setThemeType((prev) => (prev === 'light' ? 'dark' : 'light'))
    if (user?.id && !local) {
      changeTheme(user?.id, themeType, SupabaseQueries)
    }
  }

  // function to handle login/signup
  const handleAuth: handleAuthType = async (
    email,
    password,
    confirmPassword,
    username
  ) => {
    // if confirmPassord is true then the user is trying to signup
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

      // otherwise login
    } else {
      return await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })
    }
  }

  const handleOAuth = async (provider: Provider) => {
    return await supabaseClient.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${baseUrl}channels`,
      },
    })
  }

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut()
    if (!error) {
      router.push('/')
    }
  }

  // fetch user settings
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
        handleOAuth,
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
