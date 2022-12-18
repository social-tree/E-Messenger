import { Context, ContextType, Validator, createContext } from "react";

import { User } from "@supabase/supabase-js";
import { userRolesType } from "@/types/user_roles";

type UserContextType = {
  user?: User | null;
  userRoles?: userRolesType;
  signOut: () => void;
  userLoaded?: boolean;
  signIn: () => void;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  userRoles: undefined,
  signOut: () => {},
  userLoaded: undefined,
  signIn: () => {},
});

export default UserContext;
