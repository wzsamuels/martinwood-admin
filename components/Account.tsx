'use client'

import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import Image from "next/image";
import { Prisma } from "@prisma/client"
import {signOut, useSession} from "next-auth/react";
import Button from "@/components/Button";
import {SubmitHandler, useForm} from "react-hook-form";
import InputWrapper from "@/components/common/InputWrapper/InputWrapper";
import Label from "@/components/common/Label/Label";
import PieceInputs from "@/types/PieceInputs";
import ConfirmationModal from "@/components/ConfirmationModal";
import NewPieceModal from "@/components/NewPieceModal";
import NewCategoryModal from "@/components/NewCategoryModal";

const segmentItems = [
  { type: 'pieces', label: 'Pieces' },
  { type: 'categories', label: 'Categories' },

];

const Account = () => {
  const [products, setProducts] = useState<Prisma.productsCreateInput[]>([])
  const [categories, setCategories] = useState([])
  const { data: session } = useSession()

  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false)
  const [isNewPieceModalOpen, setIsNewPieceModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const productData = await fetch('/api/products').then(res => res.json())
      const categoryData = await fetch('/api/categories').then(res => res.json())
      setProducts(productData.products)
      setCategories(categoryData.categories)
    }
    fetchData()
  },[])

  useEffect(() => {
    console.log("Products:", products)
  }, [products])

  useEffect(() => {
    console.log("Categories: ", categories)
  }, [categories])

  if (!session) {
    return null
  }

  return (
    <div className='pt-16'>
    <nav className='flex justify-between items-center h-16 fixed top-0 w-full z-10 bg-black'>
      <button className='px-4 mx-2 py-2 border border-white rounded-md' onClick={() => setIsNewPieceModalOpen(true)}>Add new piece</button>
      <button className='px-4 mx-2 py-2 border border-white rounded-md' onClick={() => setIsNewCategoryModalOpen(true)}>Add new category</button>
      <button className='px-4 mx-2 py-2 border border-white rounded-md'  onClick={() => signOut()}>Sign out</button>
    </nav>
      <main className='relative'>
          <ul>
            {products?.map(product =>
              <Product product={product} key={product.id} categories={categories} setProducts={setProducts}/>
            )}
          </ul>
      </main>
      <NewPieceModal isOpen={isNewPieceModalOpen} setIsOpen={setIsNewPieceModalOpen} setProducts={setProducts}/>
      <NewCategoryModal isOpen={isNewCategoryModalOpen} setIsOpen={setIsNewCategoryModalOpen} setCategories={setCategories}/>
    </div>
  )
}

const Product = ({product, categories, setProducts}: {product: Prisma.productsCreateInput, categories: Prisma.categoriesCreateInput[], setProducts: Dispatch<SetStateAction<Prisma.productsCreateInput[]>>}) => {
  const [message, setMessage] = useState('')
  const [confirmationModal, setConfirmationModal] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<PieceInputs>({
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
    setMessage('Product updated')
  }

  const deleteProduct = async () => {
    const body = JSON.stringify({id: product.id});
    console.log(body)
    const parts = product.image.split('/')
    const key = parts[parts.length - 1];
    await fetch('/api/products/delete', {method: 'POST', body: body})
    await fetch('/api/s3/delete', {method: 'POST', body: JSON.stringify({key: key})})
    setProducts(state => state.filter(p => p.id !== product.id))
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
          <div className='my-4'>{message}</div>
        </div>
      </div>
      <hr className='my-4'/>
      <ConfirmationModal onConfirm={() => {setConfirmationModal(false); deleteProduct()}} onCancel={() => setConfirmationModal(false)} isOpen={confirmationModal} setIsOpen={setConfirmationModal} message="Are you sure you want to delete this piece?"/>
    </li>
  )
}


export default Account