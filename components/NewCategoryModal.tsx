import ModalProps from "@/types/ModalProps";
import React, {Dispatch, SetStateAction, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import Button from "@/components/Button";
import Modal from "@/components/common/Modal/Modal";
import InputWrapper from "@/components/common/InputWrapper/InputWrapper";
import Label from "@/components/common/Label/Label";
import {Prisma} from "@prisma/client";

interface NewCategoryModalProps extends ModalProps {
  setCategories: Dispatch<SetStateAction<Prisma.categoriesCreateInput[]>>
}

const NewCategoryModal = ({isOpen, setIsOpen, setCategories} : NewCategoryModalProps) => {
  const { register, handleSubmit, reset} = useForm<NewCategoryInputs>()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleNewCategory: SubmitHandler<NewCategoryInputs> = async data => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/categories', {method: 'POST', body: JSON.stringify(data)})
      setMessage('New category successfully created!');
      const categoryData = await response.json();
      const newCategory = categoryData.category;
      console.log("New category", newCategory)
      setCategories(state => [...state, {id: newCategory.id, name: newCategory.name}])
      reset();
    } catch (e) {
      setMessage('Error creating new category')
    }
    setIsLoading(false)
  }

  const renderModalContent = () => {
    if(isLoading) return (
      <div>
        <p>Creating new category...</p>
      </div>
    )

    if(message) {
      return (
        <div>
          <p className='my-4'>{message}</p>
          <div className='flex justify-center'>
            <Button onClick={() => setIsOpen(false)}>OK</Button>
          </div>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit(handleNewCategory)} className='flex flex-col max-w-md mx-auto my-4'>
        <InputWrapper className='my-4'>
          <Label className='my-2'>Name</Label>
          <input className='text-black p-2 w-full max-w-md' {...register('name')}/>
        </InputWrapper>
        <Button className='flex justify-center max-w-md' type='submit'>Submit</Button>
      </form>
    )
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} className='max-w-4xl' title='New Category'>
      {renderModalContent()}
    </Modal>
  )
}
interface NewCategoryInputs {
  name: string | null | undefined;
}

export default NewCategoryModal