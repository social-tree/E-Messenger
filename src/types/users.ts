import { User } from '@supabase/supabase-js'

export interface UserType extends User {
  id: string
  avatar: string
  username: string
  status: string
  last_online: string
}
