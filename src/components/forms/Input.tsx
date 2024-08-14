type Props = {
  inputEmail: React.RefObject<HTMLInputElement>;
  placeholderText?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: Props) {
  return (
    <input
      ref={props.inputEmail}
      type={props.type}
      id="email"
      required
      className="w-full h-12 border border-slate-400 rounded-lg px-5 py-2 focus:outline-none focus:ring-2 focus:ring-primary-medium focus:border-transparent"
      placeholder={props.placeholderText}
    />
  )
}