import { CacheProvider, EmotionCache } from '@emotion/react'
import React, { useContext, useEffect, useState } from 'react'

import { AppProps } from 'next/app'
import { CssBaseline } from '@mui/material'
import { Global } from '@emotion/react'
import { GlobalStyle } from '@/global/GlobalStyle'
import Layout from '@/Layouts/Layout'
import {
  SessionContextProvider,
  useSupabaseClient,
} from '@supabase/auth-helpers-react'
import { UserContext } from '@/context/UserContext'
import UserProvider from '@/context/UserContext'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import createEmotionCache from '@/lib/createEmotionCache'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { UpdateUserLastOnline, UpdateUserStatus } from '@/services/users'

dayjs.locale()
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const App: React.FC<MyAppProps> = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <CacheProvider value={emotionCache}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <UserProvider>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Global styles={GlobalStyle} />
        </UserProvider>
      </SessionContextProvider>
    </CacheProvider>
  )
}

export default App
