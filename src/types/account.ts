export type User = {
  id: string;
  name: string;
  email: string;
};

export type Account = {
  user: User;
  access_token: string;
};

export type ResponseLogin = {
  code: number,
  message: string,
  data: Account,
};