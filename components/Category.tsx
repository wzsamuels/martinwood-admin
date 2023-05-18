import {Prisma} from "@prisma/client";
import React, {Dispatch, SetStateAction, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import Image from "next/image";
import Input from "@/components/common/Input/Input";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import Toast from "@/components/Toast/Toast";
import UpdatePhotoModal from "@/components/UpdatePhotoModal";

interface CategoryInputs {
  name: string
}

const Category = ({category, setCategories}: {category: Prisma.categoriesCreateInput, setCategories: Dispatch<SetStateAction<Prisma.categoriesCreateInput[]>>}) => {
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [image, setImage] = useState(category.image || '')
  const [toastMessage, setToastMessage] = useState('')

  const { register, handleSubmit } = useForm<CategoryInputs>({
    defaultValues: {
      name: category.name
    }
  });

  const deleteCategory = async () => {
    const body = JSON.stringify({id: category.id});
    console.log(body)
    await fetch('/api/categories/delete', {method: 'POST', body: body})
    setCategories(state => state.filter(p => p.id !== category.id))
    setToastMessage('Category delete')
  }

  const updateCategory: SubmitHandler<CategoryInputs> = async data => {
    await fetch('/api/categories', {
      method: 'PATCH',
      body: JSON.stringify({
        id: category.id, image: image, name: data.name})})

    setCategories(state => {
      const filteredCategories = state.filter(p => p.id !== category.id)
      return [...filteredCategories, {id: category.id, image: image, name: data.name}]
    })

    setToastMessage('Category updated')
  }

  return (
    <li className='my-4'>
      <div className='flex flex-col md:flex-row'>
        <div>
          { image && <Image src={image} height={800} width={800} alt={category.name ? category.name : ""}/>}
        </div>
        <form className='px-4' onSubmit={handleSubmit(updateCategory)}>
          <div className='my-4 flex flex-col'>
            <label className='text-lg md:text-xl'>Category Name</label>
            <Input {...register('name', {required: true})} className='my-4'/>
          </div>
          <div className='flex justify-center my-4'>
            <Button type='submit' className='mx-4'>Update Category</Button>
            <Button type='button' className='mx-4' onClick={() => setUpdateModal(true)}>Change Photo</Button>
            <Button type='button' onClick={()  => setConfirmationModal(true)}>Delete</Button>
          </div>
        </form>
      </div>
      <hr className='my-4'/>
      <ConfirmationModal onConfirm={() => {setConfirmationModal(false); deleteCategory()}} onCancel={() => setConfirmationModal(false)} isOpen={confirmationModal} setIsOpen={setConfirmationModal} message="Are you sure you want to delete this category?"/>
      <UpdatePhotoModal setCategories={setCategories} isOpen={updateModal} setImage={setImage} setIsOpen={setUpdateModal}/>
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => {
            setToastMessage('');
          }}
        />
      )}
    </li>
  )
}

export default Category