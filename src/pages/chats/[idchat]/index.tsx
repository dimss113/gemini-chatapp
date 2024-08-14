import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Assistant, Chat, Message } from "@/types/data";
import { Checkbox } from "flowbite-react";
import axios from "axios";
import { get } from "http";
import { useRouter } from "next/router";
import { FormEvent, use, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Topic } from "@mui/icons-material";


export default function ChatPage() {
  const router = useRouter();
  const { idchat } = router.query;
  const { user, access_token } = useAuth();
  const [chats, setChats] = useState<Message[]>([]);
  const [assistant, setAssistant] = useState<Assistant>(
    {
      id: '',
      name: '',
      title: '',
      user_id: '',
    }
  );
  const [assistants, setAssistants] = useState<Chat[]>([]);
  const [selectedAsistantID, setSelectedAsistantID] = useState<string>('');


  const inputMessage = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>('');
  const [recommendation, setRecommendation] = useState<string[]>([]);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const getChatById = async (id: string) => { 
    console.log("BEARER", access_token);
    axios.get(`http://localhost:8000/api/chats/${id}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
      },
    }).then((res) => {
      toast.success('Chat loaded');
      const messages = res.data.data.messages;
      const assistantData = res.data.data.assistants;
      console.log(res.data.data.assistant);
      console.log(res.data.data.messages);
      setChats(messages.map((message: any) => ({
        id: message.id,
        chat_id: message.chat_id,
        sender: message.sender, 
        message: message.message,
      })));
      setAssistant({
        id: assistantData.id,
        name: assistantData.name,
        title: assistantData.title,
        user_id: assistantData.user_id,
      });
    }).catch((err) => { 
      toast.error(err.message);
    });
  }

  const sendMessage = async (message: string, chat_id: string) => {
    inputMessage.current!.value = '';
    setChats([
      ...chats,
      {
        id: message + Math.random(),
        chat_id: chat_id,
        sender: user.id,
        message: message,
      }
    ]);
    const toastId = toast.loading('Generate Answer...');
    axios.post(`http://localhost:8000/api/messages`,
      { chat_id, message },
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json',
        },
        timeout: 10000 * 60 * 100,
      }
    ).then((res) => {
      toast.remove(toastId);
      const answer = res.data.data.answer;
      toast.success('Message sent');
      console.log(answer);
      getChatById(chat_id);
    }).catch((err) => {
      toast.remove(toastId);
      toast.error(err.message);
    }
    );
  }

  const getRecommendation = async () => { 
    console.log("BEARER", access_token);
    axios.get('http://localhost:8000/api/gpt/startChat', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
      },
      timeout: 10000 * 60 * 100,
    }).then((res) => {
      toast.success('Recommendation loaded');
      const data = res.data;
      console.log(data.data);
      setRecommendation(data.data.map((message: any) => message));
    }
    ).catch((err) => {
      toast.error(err.message);
      console.log(err);
    });
  }
  

  const getAssistants = async () => {
    console.log("BEARER", access_token);
    axios.get('http://localhost:8000/api/chats', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
      },
      timeout: 10000,
    }).then((res) => {
      toast.success('Assistants loaded');
      const data = res.data;
      console.log(data.data);
      setAssistants(
        data.data.map((assistant: any) => ({
          id: assistant.id,
          topic: assistant.topic,
          assistant_id: assistant.assistant_id,
        }))
      );
    }).catch((err) => {
      toast.error(err.message);
    });
  }


   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputMessage.current?.value;
    console.log(message, idchat);
    if (message && idchat) {
      sendMessage(message, idchat as string);
    }
   }
  
   const handleSelect = (assistant: Chat) => { 
    // Set the selected assistant ID
    setSelectedAsistantID(assistant.id);
    console.log(assistant.id);
  }


  const [selectedMessage, setSelectedMessage] = useState<string>('');

  const handleSelectMessage = (message: string) => {
    setSelectedMessage(message);
    setIsSelected(true);
    sendMessage(message, idchat as string);
    alert(`Pesan terpilih: ${message}`);
  };
  
  useEffect(() => {
    if (access_token !== '' && idchat) {
      getChatById(idchat as string);
    }
  }, [access_token, idchat]);

  useEffect(() => {
    if (access_token !== '') {
      getRecommendation();
      getAssistants();
    }
  }, [access_token]);


  return (
    <Layout>
      <Toaster
        containerStyle={{
          top: 84,
          left: 20,
          bottom: 20,
          right: 20,
        }}
      />
      <section className="flex h-full w-full flex-col gap-4 overflow-auto rounded-lg dark:bg-gray-900 ">
        <div className='flex min-h-screen flex-col items-center justify-center'>
        <div>
          <h1 className="pt-[290px] mb-4 text-8xl font-baloo font-[700] text-[3rem] text-center text-black uppercase" style={{letterSpacing: 2}}>
            CHAT &amp;  <span className="text-[#B77CD7]">INBOX</span>
          </h1>
          <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400 text-center">Connect with our specialized doctors for an informative and personalized chat.</p>
        </div>


          <div className="w-[70%] min-h-screen px-5 py-10 my-20  bg-[#B9B7EA] mx-auto rounded-3xl">
            <div className=" mx-auto  min-h-screen px-4 mb-4">
              <div className="grid grid-cols-3 gap-4 h-[50rem]">
                <div className="col-span-1 lg:w-[300px] xl:w-[400px]  bg-white p-4 shadow-md rounded-md  hidden md:block">
                  {/* chat search */}
                  <input type="text" placeholder="Search"  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 mb-4" />
                  {/* chat list */}
                  <div className="max-h-96 overflow-auto" id="dokter-chat">
                  <div className="w-full flex h-full flex-col gap-3 overflow-y-scroll rounded-lg shadow-lg h-60">
                    {assistants.map((assistanted) => (
                      <div
                        key={assistanted.id}
                        className="w-full gap-3 flex justify-start items-start px-2 py-1 rounded-sm cursor-pointer"
                        // onClick={() => handleSelect(assistant)}
                        onClick={
                          () => {
                            router.push(`/chats/${assistanted.id}`);
                          }
                        }
                      >
                        {/* Render checkbox based on selection state */}
                        <Checkbox
                          checked={assistanted.assistant_id === assistant.id}
                          onChange={() => handleSelect(assistanted)}
                        />
                        <div className="w-12 h-12 bg-primary-medium rounded-full">
                          <img src="/images/chatapp.jpg" alt="assistant" className="w-full h-full rounded-full" />
                        </div>
                        <div className="flex flex-col justify-start items-start">
                          <p>{assistanted.topic}</p>
                          {/* <p>{assistanted.title}</p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </div>
                <div className="col-span-2 bg-slate-50 shadow-md rounded-m">
                  <div className="h-[60rem] md:h-[50rem] flex flex-col justify-between">  
                    {/* Chat Header */}
                    <div className="flex items-center justify-between mb-4 bg-slate-200 px-4 pt-2 pb-2 rounded-tl-md rounded-tr-md">
                      <div className="flex items-center">
                        <img src="/images/chatapp.jpg" alt="User" className="w-12 h-12 rounded-full border-2 border-white" />
                        <div className="ml-3">
                          <p className="font-semibold" id="chat-header">{ assistant!.name} </p>
                          <p className="text-gray-500">{ assistant!.title }</p>
                        </div>
                      </div>
                      <div className="relative inline-block text-left group ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#000000" className="bi bi-three-dots-vertical h-6 w-6 cursor-pointer">
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        </svg>
                        <div className="origin-top-right absolute right-0 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 hidden group-hover:block">
                          <div className="py-1">
                            <a href="" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900  cursor-pointer">Close</a>
                            <a  href="" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900  cursor-pointer">Clear Chat</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Chat body */}
                    <div className="overflow-y-scroll max-h-64 min-h-[40rem] px-4 " id="chat-container">
                      {/* add recomendation chat */}
                      {
                        !isSelected && (  <div className="p-4 bg-white shadow-md rounded-lg max-w-md mx-auto">
                              <h2 className="text-xl font-semibold mb-4">Rekomendasi Pesan</h2>
                              <ul className="space-y-2">
                                {recommendation.map((message:string, index) => (
                                  <li key={index} className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-gray-100" onClick={() => handleSelectMessage(message)}>
                                    <span className="text-sm">{message}</span>
                                    <button className="text-blue-500 hover:underline">Pilih</button>
                                  </li>
                                ))}
                              </ul>
                            </div>)
                      }
                    
                      {
                        chats.map((chat, index) => {
                          if (chat.sender === user.id) {
                            return (
                              <div key={chat.id} className="flex justify-end items-center mb-4">
                                <div className="relative group text-sm p-2 shadow bg-white rounded-md max-w-xs">
                                  {chat.message}
                                  <div className="absolute top-1/2 -translate-y-1/2 right-full ml-1 hidden group-hover:block bg-gray-600 py-1 px-1.5 rounded z-0 text-white w-max">
                                    2024-12-12 12:12:12
                                  </div>
                                </div>
                                <img
                                  src="/images/chatapp.jpg"
                                  alt="User"
                                  className="w-6 h-6 rounded-full border-2 border-white mr-1"
                                />
                              </div>   
                            )
                          } else {
                            return (
                              <div key={chat.id} className="flex items-center mb-4">
                                <img
                                  src="/images/chatapp.jpg"
                                  alt="User"
                                  className="w-6 h-6 rounded-full border-2 border-white mr-1"
                                />
                                <div className="relative group text-sm p-2 shadow bg-white rounded-md max-w-xs">
                                  {chat.message}
                                  <div className="absolute top-1/2 -translate-y-1/2 left-full ml-1 hidden group-hover:block bg-gray-600 py-1 px-1.5 rounded z-0 text-white w-max">
                                  fsdfsdfsdfs
                                  </div>
                                </div>
                              </div>
                            )
                          }
                        })
                      }
                    </div>
                    
                    {/* Chat Footer */}
                    <form id="chat-form" className="flex items-center p-4  bg-white rounded-bl-md rounded-br-md" onSubmit={handleSubmit}>
                      <input ref={inputMessage} onChange={
                        (e) => setMessage(e.target.value)
                      } name="message" id="chat-data-input" type="text" placeholder="Search" className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-400" />
                      <button id="send-button" type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400 ml-2"
                      disabled={message === '' ? true : false}
                      >Send</button>
                    </form>
                  </div>
         
                </div>
              </div>
            </div>
          </div>


          

        </div>
      </section>
    </Layout>
  )
}