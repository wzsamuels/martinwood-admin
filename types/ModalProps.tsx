import {Dispatch, SetStateAction} from "react";

export default interface ModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
