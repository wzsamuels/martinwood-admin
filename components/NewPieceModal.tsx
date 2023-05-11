import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import Modal from "@/components/common/Modal/Modal";
import {SubmitHandler, useForm} from "react-hook-form";
import {Prisma} from "@prisma/client";
import {v4 as uuidv4} from "uuid";
import Button from "@/components/Button";
import InputWrapper from "@/components/common/InputWrapper/InputWrapper";
import Label from "@/components/common/Label/Label";
import Image from "next/image";
import PieceInputs from "@/types/PieceInputs";
import ModalProps from "@/types/ModalProps";

interface NewPieceModalProps extends ModalProps {
  setProducts: Dispatch<SetStateAction<Prisma.productsCreateInput[]>>
}

const NewPieceModal = ({isOpen, setIsOpen, setProducts} : NewPieceModalProps) => {
  const { register, handleSubmit} = useForm<PieceInputs>()
  const [selectedFile, setSelectedFile] = useState<Blob>()
  const [preview, setPreview] = useState('')
  const [categories, setCategories] = useState<Prisma.categoriesCreateInput[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryData = await fetch('/api/categories').then(res => res.json())
      if(categoryData.categories)
        setCategories(categoryData.categories)
    }
    fetchCategories()
  },[])

  useEffect(() => {
    if (!selectedFile) {
      setPreview('')
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleNewProduct: SubmitHandler<PieceInputs> = async data => {
    if(!selectedFile) return;
    setIsLoading(true)
    const extension = selectedFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${extension}`;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', fileName);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('File uploaded successfully');
      setMessage('Piece created successfully')
    } else {
      console.error('Error uploading file');
      setMessage('Error creating piece')
    }
    const newPiece = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify({...data, image: `https://martinwoodworks.s3.amazonaws.com/${fileName}`})
    })
    const res = await newPiece.json()
    console.log(res.newProduct)
    if(res.newProduct) {
      // @ts-ignore
      setProducts(state =>
        [...state, {description: data.description, category: data.category, image: res.newProduct.image, id: res.newProduct.id}])
    }
    setIsLoading(false)
  }

  const dismissModal = () => {
    setIsOpen(false)
    setMessage('')
    setPreview('')
    setSelectedFile(undefined)

  }

  const renderModalContent = () => {
    if(isLoading) return (
      <div>
        <p>Creating new piece...</p>
      </div>
    )

    if(message) {
      return (
        <div className='flex justify-center flex-col'>
          <p className='my-4'>{message}</p>
          <div className='flex justify-center'>
            <Button onClick={dismissModal}>OK</Button>
          </div>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit(handleNewProduct)} className='flex flex-col max-w-md mx-auto my-4'>
        <InputWrapper className='my-4'>
          <Label className='my-2'>Description</Label>
          <textarea className='text-black p-2 w-full max-w-md' {...register('description')}/>
        </InputWrapper>
        <InputWrapper className='my-4'>
          <Label className='my-2'>Category</Label>
          <select className='text-black max-w-md w-full' {...register('category')}>
            {categories.map(category =>
              <option value={category.name} key={category.name}>{category.name}</option>)}
          </select>
        </InputWrapper>


        {preview && <Image className='w-full' width={800} height={800} src={preview} alt="Preview"/>}
        <label
          htmlFor='upload-profile-image-photo'
          className='my-4 cursor-pointer flex justify-center py-2 border w-full max-w-md  mx-auto  text-white border-primary-default'>
          Select Photo
        </label>
        <input
          type='file'
          id='upload-profile-image-photo'
          accept="image/png, image/jpeg"
          onChange={e => e?.target?.files && setSelectedFile(e.target.files[0])}
          className='my-4 hidden'
        />
        <Button className='flex justify-center max-w-md' type='submit'>Submit</Button>
      </form>
    )
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} className='max-w-4xl' title='New Piece'>
      {renderModalContent()}
    </Modal>
  )
}

export default NewPieceModal