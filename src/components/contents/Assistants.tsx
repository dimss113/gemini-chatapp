import { useAuth, useAuthDispatch } from "@/hooks/useAuth";
import { Assistant, Chat } from "@/types/data";
import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";
import Input from "../forms/Input";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import CreateAssistant from "../forms/CreateAssistant";
import CreateChat from "../forms/CreateChat";
import { useRouter } from "next/router";


export default function Assistants() {
  const { access_token } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  const inputSearchAssistant = useRef<HTMLInputElement>(null);
  const [searchAssistant, setSearchAssistant] = useState<string>('');
  const authDispatch = useAuthDispatch();

  // for assistants
  const inputName = useRef<HTMLInputElement>(null);
  const inputTitle = useRef<HTMLInputElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(false); 

  // for chats
  const [selectedAsistantID, setSelectedAsistantID] = useState<string>('');
  const inputTopic = useRef<HTMLInputElement>(null);
  const [openModalChat, setOpenModalChat] = useState<boolean>(false); 

  const router = useRouter();

  

  function onCloseModal() {
    setOpenModal(false);
  };

  function onCloseModalChat() {
    setOpenModalChat(false);
    setSelectedAsistantID('');
    // reset input topic
    inputTopic.current!.value = '';
  };

  const getAssistants = async () => {
    console.log("BEARER", access_token);
    axios.get('http://localhost:8000/api/assistants', {
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
          name: assistant.name,
          title: assistant.title,
        }))
      );
      setLoading(false);  
    }).catch((err) => {
      toast.error(err.message);
    });
  }

  const getChats = async () => {

    axios.get('http://localhost:8000/api/chats', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
      },
      timeout: 10000,
    }).then((res) => {
      toast.success('chat loaded');
      const data = res.data;
      console.log(data.data);
      setChats(
        data.data.map((chat: any) => ({
          id: chat.id,
          topic: chat.topic,
          assistant_id: chat.assistant_id,
          user_id: chat.user_id,
        }))
      );
      setLoading(false);  
    }).catch((err) => {
      toast.error(err.message);
    });
  }

  const createAssistant = async (name: string, title: string) => {
    const toastId = toast.loading('Creating assistant...');
    axios.post(
      'http://localhost:8000/api/assistants',
      { name, title }, // Data yang dikirim dalam body
      {
        headers: {
          'Authorization': `Bearer ${access_token}`, // Gunakan token yang sesuai
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      }
    ).then((res) => {
      toast.remove(toastId);
      toast.success('Assistant created');
      getAssistants();
      onCloseModal();
    }).catch((err) => {
      toast.remove(toastId);
      toast.error(err.message);
    });
  }

  const createChat = async (assistant_id: string, topic: string) => {
    const toastId = toast.loading('Creating assistant...');
    console.log(assistant_id, topic);
    axios.post(
      'http://localhost:8000/api/chats',
      { topic, assistant_id }, // Data yang dikirim dalam body
      {
        headers: {
          'Authorization': `Bearer ${access_token}`, // Gunakan token yang sesuai
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      }
    ).then((res) => {
      toast.remove(toastId);
      toast.success('Chat created');
      getChats();
      onCloseModalChat();
    }).catch((err) => {
      console.error('Error response:', err.response); // Tampilkan detail error
      toast.remove(toastId);
      toast.error(err.message);
    });
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = inputName.current?.value;
    const title = inputTitle.current?.value;
    console.log(name, title);
    if (name && title) {
      createAssistant(name, title);
    }
  }

  const handleSubmitChat = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const assistant_id = selectedAsistantID;
    const topic = inputTopic.current?.value;
    console.log(assistant_id, topic);
    if (assistant_id && topic) {
      createChat(assistant_id, topic);
    }
  }

  useEffect(() => {
    if (access_token !== '') {
      getAssistants();
    }
  }, [searchAssistant, access_token]);

  useEffect(() => {
    if (access_token !== '') {
      getChats();
    }
  }, [searchAssistant, access_token]);

  return loading? (
    <Loader></Loader>
  ) : (
      <div className="w-full flex justify-center items-start gap-10">
        <div className="flex flex-col justify-center items-start w-96  gap-4 ">
          <div className="flex justify-between w-full items-center gap-3">
            <Input type="text" placeholderText="Search assistant" inputEmail={inputSearchAssistant} onChange={(e) => setSearchAssistant(e.target.value)} />
            <button className="w-24 px-3 h-12 bg-primary-medium text-white rounded-lg" onClick={getAssistants}>Search
            </button>
          </div>
          <div className="w-full flex flex-col gap-3 overflow-y-scroll  rounded-lg shadow-lg h-60">
            {assistants.map((assistant) => (
              // <div key={assistant.id} className="w-full flex justify-between items-center">
              //   <p>{assistant.name}</p>
              //   <p>{assistant.title}</p>
              // </div>
              <div key={assistant.id} className="w-full gap-3 flex justify-start items-start px-2 py-1 rounded-sm">
                {/* add circle profile */}
                <div className="w-12 h-12 bg-primary-medium rounded-full">
                  <img src="/images/chatapp.jpg" alt="assistant" className="w-full h-full rounded-full" />
                </div>
                <div className="flex flex-col justify-start items-start">
                  <p>{assistant.name}</p>
                  <p>{assistant.title}</p>
                </div>
              </div>
            ))}
          </div>
          <CreateAssistant inputNameRef={inputName} inputTitleRef={inputTitle} createAssistant={handleSubmit} openModal={openModal} setOpenModal={setOpenModal} onCloseModal={onCloseModal} />
            
        </div>

        
        {/* Chats */}
        
        <div className="flex flex-col  justify-center items-start w-96  gap-4 ">
          <div className="flex justify-between w-full items-center gap-3">
            <Input type="text" placeholderText="Search chats" inputEmail={inputSearchAssistant} onChange={(e) => setSearchAssistant(e.target.value)} />
            <button className="w-24 px-3 h-12 bg-primary-medium text-white rounded-lg" onClick={getAssistants}>Search
            </button>
          </div>
          <div className="w-full flex flex-col gap-3 overflow-y-scroll  rounded-lg shadow-lg h-60">
            {chats.map((chat) => (
              // <div key={assistant.id} className="w-full flex justify-between items-center">
              //   <p>{assistant.name}</p>
              //   <p>{assistant.title}</p>
              // </div>
              <div key={chat.id} className="w-full gap-3 flex justify-start items-start px-2 py-1 rounded-sm cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  router.push(`/chats/${chat.id}`);
                }}
              >
                {/* add circle profile */}
                <div className="w-12 h-12 bg-primary-medium rounded-full">
                  <img src="/images/chatapp.jpg" alt="assistant" className="w-full h-full rounded-full" />
                </div>
                <div className="flex flex-col justify-start items-start">
                  <p>{chat.topic}</p>
                  {/* <p>{assistant.title}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
       <CreateChat inputTopicRef={inputTopic} createChats={handleSubmitChat} openModal={openModalChat} setOpenModal={setOpenModalChat} onCloseModal={onCloseModalChat} assistants={assistants} selectedAsistantID={selectedAsistantID} setSelectedAsistantID={setSelectedAsistantID} />
      </div>
  )
};