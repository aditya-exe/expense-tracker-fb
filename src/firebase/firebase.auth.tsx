import { NextOrObserver, onAuthStateChanged, User, signOut as authSignOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase.config";

type IAuthUser = {
  uid: string,
  email: string | null,
} | null;

type IAuthContext = {
  authUser: IAuthUser,
  isLoading: boolean,
  signOut: () => {},
};

const useFirebaseAuth = () => {
  const [authUser, setAuthUser] = useState<IAuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  }

  const authStateChanged = async (user: User) => {
    setIsLoading(true);
    if (!user) {
      clear();
      return;
    }
    setAuthUser({
      uid: user.uid,
      email: user.email,
    });
    setIsLoading(false);
  };

  const signOut = () => authSignOut(auth).then(clear);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged as NextOrObserver<User>);
    return () => unsubscribe();
  }, []);

  return { authUser, isLoading, signOut };
}

export default useFirebaseAuth;

const AuthUserContext = createContext<IAuthContext>({
  authUser: null,
  isLoading: true,
  signOut: async () => { },
});

export const AuthUserProvider = ({ children }: { children: any }) => {
  const auth = useFirebaseAuth();
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
}

export const useAuth = () => useContext(AuthUserContext);