import { Alert, Snackbar } from '@mui/material'

import { UserContext } from '@/context/UserContext'
import { useContext } from 'react'

interface Props {
  children: JSX.Element | JSX.Element[]
}

const Layout: React.FC<Props> = ({ children }) => {
  const { snackbarMessage, setSnackbarMessage } = useContext(UserContext)

  return (
    <>
      <Snackbar
        onClose={() => setSnackbarMessage('')}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={!!snackbarMessage}
      >
        <Alert
          onClose={() => setSnackbarMessage('')}
          severity="success"
          sx={{ width: { xl: '100%', xs: '70%' } }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {children}
    </>
  )
}

export default Layout
