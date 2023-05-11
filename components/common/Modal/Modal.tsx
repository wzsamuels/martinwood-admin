import React, { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {IoMdClose} from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: React.ReactNode;
  title?: ReactNode;
  onClose?: () => void;
  className?: string;
}

const Modal = ({ isOpen, setIsOpen, children, title, onClose, className }: ModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full h-full transform rounded-2xl border border-white bg-black p-6 text-left align-middle shadow-xl transition-all overflow-y-auto ${className}`}>
                {title && (
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 pb-4 text-gray-900 flex justify-between w-full relative"
                >
                  <span className='w-full after:left-0 after:w-full after:absolute after:h-[1px] after:bottom-0 after:bg-primary-default'>{title}</span>
                  <button className='text-white text-2xl' onClick={() => { setIsOpen(false); onClose && onClose(); }}><IoMdClose /></button>
                </Dialog.Title>)}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
