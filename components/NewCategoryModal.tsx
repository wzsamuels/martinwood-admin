import ModalProps from "@/types/ModalProps";
import React, {Dispatch, SetStateAction, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import Button from "@/components/Button";
import Modal from "@/components/common/Modal/Modal";
import InputWrapper from "@/components/common/InputWrapper/InputWrapper";
import Label from "@/components/common/Label/Label";
import {Prisma} from "@prisma/client";
import Image from "next/image";
import {BiCheck} from "react-icons/bi";

interface NewCategoryModalProps extends ModalProps {
  setCategories: Dispatch<SetStateAction<Prisma.categoriesCreateInput[]>>
  products: Prisma.productsCreateInput[]
}

const NewCategoryModal = ({isOpen, setIsOpen, setCategories, products} : NewCategoryModalProps) => {
  const { register, handleSubmit, reset} = useForm<NewCategoryInputs>()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Prisma.productsCreateInput | null>(null)

  const handleNewCategory: SubmitHandler<NewCategoryInputs> = async data => {
    setIsLoading(true)
    if(!selectedProduct) return;
    try {
      const response = await fetch('/api/categories', {method: 'POST', body: JSON.stringify(data)})
      setMessage('New category successfully created!');
      const categoryData = await response.json();
      const newCategory = categoryData.category;
      console.log("New category", newCategory)
      setCategories(state => [...state, {id: newCategory.id, name: newCategory.name, image: selectedProduct.image}])
      reset();
    } catch (e) {
      setMessage('Error creating new category')
    }
    setIsLoading(false)
  }

  const dismissModal = () => {
    setIsOpen(false)
    setMessage('')
    reset()
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
            <Button onClick={dismissModal}>OK</Button>
          </div>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit(handleNewCategory)} className='flex flex-col mx-auto my-4'>
        <div className='my-4 text-2xl'>Category Image</div>
        <div className='flex flex-wrap gap-4'>
        {
          products.map(product =>
            <div className='relative w-[300px] h-[300px] cursor-pointer group' onClick={() => setSelectedProduct(product)} key={product.id}>
              <Image className='w-full h-full object-cover' width={300} height={300} src={product.image} alt="" />
              <div className={`absolute top-0 left-0  group-hover:block bg-black bg-opacity-20 w-full h-full ${selectedProduct?.id === product.id ? 'block' : 'hidden'}`}/>
              { selectedProduct?.id === product.id &&
                <div className='absolute left-2 top-2 bg-white p-2 rounded-full shadow-2xl'>
                  <BiCheck className='text-red text-xl'/>
                </div>
              }
            </div>)
        }
        </div>
        <div className='flex flex-col mx-auto max-w-4xl'>
          <InputWrapper className='my-4'>
            <Label className='my-2'>Category Name</Label>
            <input className='text-black p-2 w-full max-w-md' {...register('name')}/>
          </InputWrapper>
          <Button className='flex justify-center max-w-md' type='submit'>Submit</Button>
        </div>
      </form>
    )
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={dismissModal} className='max-w-6xl' title='New Category'>
      {renderModalContent()}
    </Modal>
  )
}
interface NewCategoryInputs {
  name: string | null | undefined;
}

export default NewCategoryModal