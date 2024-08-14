
export type Assistant = {
  id: string;
  name: string;
  title: string;
  user_id: string;
};

export type Chat = {
  id: string;
  topic: string;
  assistant_id: string;
  user_id: string;
};

export type Message = {
  id: string;
  chat_id: string;
  sender: string;
  message: string;
}