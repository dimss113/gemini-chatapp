export type AuthProps = {
  role: string | string[];
  loading: JSX.Element;
  unauthorized: string;
} | undefined;

export type STATUS = 'authenticated' | 'unauthenticated' | 'loading';

export const ADMIN = 'admin';
export const USER = 'user';