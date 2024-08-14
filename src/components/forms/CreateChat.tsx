import { useAuth } from "@/hooks/useAuth";
import { Assistant } from "@/types/data";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import React, { FormEvent, useState } from "react";

type CreateChatProps = {
  inputTopicRef: React.RefObject<HTMLInputElement>;
  createChats: (e: FormEvent<HTMLFormElement>) => void;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseModal: () => void; 
  assistants: Assistant[];
  selectedAsistantID: string;
  setSelectedAsistantID: React.Dispatch<React.SetStateAction<string>>;
}

export default function CreateChat(
  props: CreateChatProps
) { 
  const [topic, setTopic] = useState<string>('');

  const handleSelect = (assistant: Assistant) => { 
    // Set the selected assistant ID
    props.setSelectedAsistantID(assistant.id);
    console.log(assistant.id);
  }

  return (
    <>
      <Button onClick={() => props.setOpenModal(true)} className="bg-primary-light">Create Chats</Button>
      <Modal show={props.openModal} size="md" onClose={props.onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form className="space-y-6" onSubmit={props.createChats}>
            <div>
              <div className="w-full flex flex-col gap-3 overflow-y-scroll rounded-lg shadow-lg h-60">
                {props.assistants.map((assistant) => (
                  <div
                    key={assistant.id}
                    className="w-full gap-3 flex justify-start items-start px-2 py-1 rounded-sm"
                    onClick={() => handleSelect(assistant)}
                  >
                    {/* Render checkbox based on selection state */}
                    <Checkbox
                      checked={props.selectedAsistantID === assistant.id}
                      onChange={() => handleSelect(assistant)}
                    />
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

              <div className="mb-2 block mt-4">
                <Label htmlFor="name" value="Topik Title" />
              </div>
              <TextInput
                ref={props.inputTopicRef}
                id="title"
                placeholder="Topik Title"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <Button type="submit" className="bg-primary-light">Create</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}
