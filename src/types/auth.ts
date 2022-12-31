import { AuthError, Session, User } from '@supabase/supabase-js'

export type handleAuthType = (
  email: string,
  password: string,
  confirmPassword?: string
) => Promise<AuthResponse>

export interface AuthResponse {
  data: {
    user: User | null
    session: Session | null
  }
  error: AuthError | { message: string } | null
}
