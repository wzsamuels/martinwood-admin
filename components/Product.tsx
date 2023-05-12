import {Prisma} from "@prisma/client";
import React, {Dispatch, SetStateAction, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import PieceInputs from "@/types/PieceInputs";
import Image from "next/image";
import InputWrapper from "@/components/common/InputWrapper/InputWrapper";
import Label from "@/components/common/Label/Label";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import Toast from "@/components/Toast/Toast";

const Product = ({product, categories, setProducts}: {product: Prisma.productsCreateInput, categories: Prisma.categoriesCreateInput[], setProducts: Dispatch<SetStateAction<Prisma.productsCreateInput[]>>}) => {
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const { register, handleSubmit } = useForm<PieceInputs>({
    defaultValues: {
      description: product.description,
      category: product.category
    }
  });

  const updateProduct: SubmitHandler<PieceInputs> = async data => {
    await fetch('/api/products', {
      method: 'PATCH',
      body: JSON.stringify({
        id: product.id, image: product.image, description: data.description, category: data.category})})
    setToastMessage('Product updated')
  }

  const deleteProduct = async () => {
    const body = JSON.stringify({id: product.id});
    console.log(body)
    const parts = product.image.split('/')
    const key = parts[parts.length - 1];
    await fetch('/api/products/delete', {method: 'POST', body: body})
    await fetch('/api/s3/delete', {method: 'POST', body: JSON.stringify({key: key})})
    setProducts(state => state.filter(p => p.id !== product.id))
    setToastMessage('Product delete')
  }

  return (
    <li className='my-4'>
      <div className='flex flex-col md:flex-row'>
        <div>
          <Image src={product.image} height={800} width={800} alt={product.description ? product.description : ""}/>
        </div>
        <div className='px-4'>
          <form onSubmit={handleSubmit(updateProduct)}>
            <InputWrapper className='my-4'>
              <Label className='my-2'>Description</Label>
              <textarea className='text-black p-2 w-full max-w-md' {...register('description')}/>
            </InputWrapper>
            <InputWrapper className='my-4'>
              <Label className='my-2'>Category</Label>
              <select className='text-black max-w-md w-full' {...register('category')}>
                {categories.map(category =>
                  <option value={category.name} key={category.id}>{category.name}</option>)}
              </select>
            </InputWrapper>
            <div className='flex justify-center'>
              <Button type='submit'>Update</Button>
            </div>

          </form>
          <div className='flex justify-center'>
            <Button className='my-4' onClick={()  => setConfirmationModal(true)}>Delete</Button>
          </div>
        </div>
      </div>
      <hr className='my-4'/>
      <ConfirmationModal onConfirm={() => {setConfirmationModal(false); deleteProduct()}} onCancel={() => setConfirmationModal(false)} isOpen={confirmationModal} setIsOpen={setConfirmationModal} message="Are you sure you want to delete this piece?"/>
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

export default Product