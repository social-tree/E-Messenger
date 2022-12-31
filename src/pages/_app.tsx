import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react'
import React, { useEffect, useState } from 'react'

import { AppProps } from 'next/app'
import { CssBaseline } from '@mui/material'
import { Global } from '@emotion/react'
import { GlobalStyle } from '@/global/GlobalStyle'
import Layout from '@/Layouts/Layout'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { User } from '@supabase/supabase-js'
import UserContext from '@/context/UserContext'
import UserProvider from '@/context/UserContext'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import createEmotionCache from '@/lib/createEmotionCache'
import { theme } from '@/global/theme'
import { useRouter } from 'next/router'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const App: React.FC<MyAppProps> = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) => {
  const router = useRouter()
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  useEffect(() => {
    const {
      data: { subscription: authListener },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') router.push('/forgot-password')
      if (event === 'SIGNED_IN') router.push('/channels/1')
    })
    return () => {
      authListener.unsubscribe()
    }
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <UserProvider>
          <CssBaseline />
          <ThemeProvider theme={theme.light}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
          <Global styles={GlobalStyle} />
        </UserProvider>
      </SessionContextProvider>
    </CacheProvider>
  )
}

export default App
