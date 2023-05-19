import Modal from "@/components/common/Modal/Modal";
import ModalProps from "@/types/ModalProps";
import Button from "@/components/Button";

interface ConfirmationModalProps extends ModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationModal = ({onConfirm, onCancel, isOpen, setIsOpen, message} : ConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} className='w-full max-w-xl'>
      <div className="mx-auto">
        <div>
          {message}
        </div>
        <div className='flex justify-center my-4'>
          <Button className='mx-4' onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>OK</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal;