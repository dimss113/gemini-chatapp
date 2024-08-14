import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useReducer } from "react";


import { USER_STORAGE_KEY } from "@/storageKey";
import { AuthProps, STATUS } from "@/types/AuthProps";
import { Account } from "@/types/account";

export type ComponentWithAuth = AppProps['Component'] & { auth: AuthProps; };

type AuthContextType = Account & {
  status: STATUS;
};

type AuthDispatchContextType = React.Dispatch<AuthActionType>;

type AuthActionType = 
  | { type: 'LOGIN'; payload: Account }
  | { type: 'LOGOUT'; }
  | { type: 'POPULATE'; payload: Account; }
  | { type: 'UPDATE_TOKEN'; payload: string; }
  | { type: 'START_LOADING'; }
  | { type: 'SET_STATUS'; payload: STATUS; }
  | { type: 'SAVE_AUTH'; }
  | { type: 'LOAD_AUTH'; }
  | { type: 'CLEAR_AUTH'; }

const initial_value = { status: 'unauthenticated', user: {}, access_token: '' };

function reducer(state: AuthContextType, action: AuthActionType) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        status: 'authenticated',
        user: action.payload.user,
        access_token: action.payload.access_token,
      };
    case 'LOGOUT':
      return {
        ...state,
        status: 'unauthenticated',
        user: {},
        access_token: '',
      };
    case 'POPULATE':
      return {
        ...state,
        ...action.payload,
      };
    case 'UPDATE_TOKEN':
      return {
        ...state,
        access_token: action.payload,
      };
    case 'START_LOADING':
      return {
        ...state,
        status: 'loading',
      };
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
      };
    case 'SAVE_AUTH':
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state));
      return {
        ...state,
      };
    case 'LOAD_AUTH':
      const currentUserDataJSON = localStorage.getItem(USER_STORAGE_KEY);
      const currentUserData = JSON.parse(
        currentUserDataJSON || JSON.stringify(initial_value)
      );
      return {
        ...state,
        ...currentUserData,
      };
    case 'CLEAR_AUTH':
      localStorage.removeItem(USER_STORAGE_KEY);
      return {
        ...state,
      };
  }
}

const AuthContext = createContext({
  status: 'unauthenticated',
  user: {},
  access_token: '',
} as AuthContextType);

const AuthDispatchContext = createContext<AuthDispatchContextType>(() => {
  return;
});

export function AuthProvider({ children }: { children: JSX.Element; }) {
  const [state, dispatch] = useReducer(reducer, initial_value);

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        <MiddlewareAuth>{children}</MiddlewareAuth>
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);

function MiddlewareAuth({ children }: { children: JSX.Element; }) {
  const { status } = useAuth();
  const dispatch = useAuthDispatch();
  const router = useRouter();

  useEffect(() => {
    const currentUserDataJSON = localStorage.getItem(USER_STORAGE_KEY);
    const currentUserData = JSON.parse(
      currentUserDataJSON as string
    ) as AuthContextType;

    if (currentUserData && currentUserData.access_token) {
      initial_value.status = 'authenticated';
      initial_value.user = currentUserData.user;
      initial_value.access_token = currentUserData.access_token;
      dispatch({
        type: 'LOGIN',
        payload: {
          user: currentUserData.user,
          access_token: currentUserData.access_token,
        },
      });
    } else {
      dispatch(
        {
          type: 'SET_STATUS',
          payload: 'unauthenticated',
        }
      )
    }
  }, [dispatch]);

  const Component = children.type as ComponentWithAuth;

  if (typeof Component.auth === 'undefined') {
    return children;
  }

  if (typeof window === 'undefined' || status === 'loading') {
    return Component.auth.loading;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return children;
}