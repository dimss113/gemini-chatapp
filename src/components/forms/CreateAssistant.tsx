import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";

type CreateAssistantProps = {
  inputNameRef: React.RefObject<HTMLInputElement>;
  inputTitleRef: React.RefObject<HTMLInputElement>;
  createAssistant: (e: FormEvent<HTMLFormElement>) => void;
  // add props usestate for openModal
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseModal: () => void; 
  
}


export default function CreateAssistant(
  props: CreateAssistantProps
) { 
  // const [openModal, setOpenModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [title, setTitle] = useState<string>('');


  // function onCloseModal() {
  //   setOpenModal(false);
  //   setName('');
  //   setTitle('');
  // };

  return (
    <>
      <Button onClick={() => props.setOpenModal(true)} className="bg-primary-light">Create Assistant</Button>
      <Modal show={props.openModal} size="md" onClose={props.onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form className="space-y-6" onSubmit={props.createAssistant}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Assistant name" />
              </div>
              <TextInput
                ref={props.inputNameRef}
                id="name"
                placeholder="Assistant name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <div className="mb-2 block mt-4">
                <Label htmlFor="name" value="Topik Title" />
              </div>
              <TextInput
                ref={props.inputTitleRef}
                id="title"
                placeholder="Topik Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
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