import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react'
import React, { useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { ThemeType, theme } from '@/global/theme'

import { AppProps } from 'next/app'
import { CssBaseline } from '@mui/material'
import { Global } from '@emotion/react'
import { GlobalStyle } from '@/global/GlobalStyle'
import Layout from '@/Layout'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import UserContext from '@/lib/UserContext'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import createEmotionCache from '@/lib/createEmotionCache'
import { fetchUserRoles } from '@/lib/Store'
import { useRouter } from 'next/router'
import { useUser } from '@/hooks/useUser'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const App: React.FC<MyAppProps> = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) => {
  const [userLoaded, setUserLoaded] = useState(false)
  const [userRoles, setUserRoles] = useState<Array<string>>([])
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  const signIn = async () => {
    return await fetchUserRoles((userRoles: { role: string }[]) =>
      setUserRoles(userRoles.map((userRole) => userRole.role))
    )
  }

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut()
    if (!error) {
      router.push('/')
    }
  }

  useEffect(() => {
    supabaseClient.auth.getUser().then((res) => setUser(res.data.user))
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      {' '}
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <UserContext.Provider
          value={{
            userLoaded,
            user,
            userRoles,
            signIn,
            signOut,
          }}
        >
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <ThemeProvider theme={theme.light}>
            <Component {...pageProps} />
          </ThemeProvider>
          <Global styles={GlobalStyle} />
        </UserContext.Provider>
      </SessionContextProvider>
    </CacheProvider>
  )
}

export default App
