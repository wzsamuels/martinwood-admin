import ModalProps from "@/types/ModalProps";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Prisma} from "@prisma/client";
import Modal from "@/components/common/Modal/Modal";
import Image from "next/image";
import {BiCheck} from "react-icons/bi";
import Button from "@/components/Button";

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

export default UpdatePhotoModal