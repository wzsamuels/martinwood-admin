'use client'

import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import Image from "next/image";
import { Prisma } from "@prisma/client"
import {signOut, useSession} from "next-auth/react";
import Button from "@/components/Button";
import {SubmitHandler, useForm} from "react-hook-form";
import ConfirmationModal from "@/components/ConfirmationModal";
import NewPieceModal from "@/components/NewPieceModal";
import NewCategoryModal from "@/components/NewCategoryModal";
import Segment from "@/components/common/Segment/Segment";
import Spinner from "@/components/common/Spinner/Spinner";
import Product from "@/components/Product";
import Modal from "@/components/common/Modal/Modal";
import {BiCheck} from "react-icons/bi";
import ModalProps from "@/types/ModalProps";
import Input from "@/components/common/Input/Input";
import Toast from "@/components/Toast/Toast";

const segmentTypes = [
  {type: 'pieces', label: 'Pieces'},
  {type: 'categories', label: 'Categories'}
]

const Account = () => {
  const [products, setProducts] = useState<Prisma.productsCreateInput[]>([])
  const [categories, setCategories] = useState<Prisma.categoriesCreateInput[]>([])
  const [segmentType, setSegmentType] = useState('pieces')
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false)
  const [isNewPieceModalOpen, setIsNewPieceModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const productData = await fetch('/api/products').then(res => res.json())
      const categoryData = await fetch('/api/categories').then(res => res.json())
      setProducts(productData.products)
      setCategories(categoryData.categories)
      setIsLoading(false);
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
    <div className='pt-28 md:pt-24'>
    <nav className='flex flex-col md:flex-row justify-between items-center h-30 sm:h-28 md:h-24 fixed top-0 w-full z-10 bg-black p-4'>
      <Segment segmentType={segmentType} setSegmentType={setSegmentType} items={segmentTypes}/>
      <div className='flex mt-4 md:mt-0'>
        <button className='px-4 mx-2 py-2 border border-white rounded-md' onClick={() => setIsNewPieceModalOpen(true)}>New piece</button>
        <button className='px-4 mx-2 py-2 border border-white rounded-md' onClick={() => setIsNewCategoryModalOpen(true)}>New category</button>
        <button className='px-4 mx-2 py-2 border border-white rounded-md' onClick={() => signOut()}>Sign out</button>
      </div>
    </nav>
      {
        isLoading ?
          <main className='flex flex-col items-center justify-center h-screen'>
            <div className='mb-8'>Loading...</div>
            <div><Spinner/></div>
          </main>
          :
          <main className='relative'>
            <ul>
            {
              segmentType === 'pieces' ?
                products?.map(product =>
                  <Product product={product} key={product.id} categories={categories} setProducts={setProducts}/>)
                :
                categories?.map(category =>
                  <Category category={category} setCategories={setCategories} key={category.id}/>)
            }
            </ul>
          </main>
      }
      <NewPieceModal isOpen={isNewPieceModalOpen} setIsOpen={setIsNewPieceModalOpen} setProducts={setProducts}/>
      <NewCategoryModal isOpen={isNewCategoryModalOpen} setIsOpen={setIsNewCategoryModalOpen} setCategories={setCategories} products={products}/>
    </div>
  )
}

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

interface UpdatePhotoModalProps extends ModalProps {
  setCategories: Dispatch<SetStateAction<Prisma.categoriesCreateInput[]>>
  setImage:Dispatch<SetStateAction<string>>
}

const UpdatePhotoModal = ({isOpen, setIsOpen, setImage}: UpdatePhotoModalProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Prisma.productsCreateInput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Prisma.productsCreateInput[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const productData = await fetch('/api/products').then(res => res.json())
      setProducts(productData.products)
      setIsLoading(false);
    }
    fetchData()
  },[])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title='Choose a photo'>
      <div className='flex flex-wrap justify-center gap-4'>
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
      <div className='flex justify-center mt-6'>
        <Button className='mx-4' onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button onClick={() => {setImage(selectedProduct?.image || ''); setIsOpen(false)}}>OK</Button>
      </div>
    </Modal>
  )
}

export default Account