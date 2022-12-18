import React, { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { fetchUserRoles, supabase } from "@/lib/Store";

import { AppProps } from "next/app";
import UserContext from "@/lib/UserContext";
import { useRouter } from "next/router";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<Array<string>>([]);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserLoaded(session ? true : false);
      if (session?.user) {
        signIn();
        router.push("/channels/[id]", "/channels/1");
      }
    });

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      setUserLoaded(!!user);
    };

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      setUserLoaded(!!currentUser);
      if (currentUser) {
        router.push("/channels/[id]", "/channels/1");
      } else {
        router.push("/");
      }
    });

    if (!user && !userLoaded) getUser();
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    return await fetchUserRoles((userRoles: { role: string }[]) =>
      setUserRoles(userRoles.map((userRole) => userRole.role))
    );
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    }
  };

  return (
    <UserContext.Provider
      value={{
        userLoaded,
        user,
        userRoles,
        signIn,
        signOut,
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
};

export default App;
