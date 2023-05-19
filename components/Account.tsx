'use client'

import React, {useEffect, useState} from "react";
import { Prisma } from "@prisma/client"
import {signOut, useSession} from "next-auth/react";
import NewPieceModal from "@/components/NewPieceModal";
import NewCategoryModal from "@/components/NewCategoryModal";
import Segment from "@/components/common/Segment/Segment";
import Spinner from "@/components/common/Spinner/Spinner";
import Product from "@/components/Product";
import Category from "@/components/Category";
import Review from "@/components/Review";

const segmentTypes = [
  {type: 'pieces', label: 'Pieces'},
  {type: 'categories', label: 'Categories'},
  {type: 'reviews', label: 'Reviews'}
]

const Account = () => {
  const [products, setProducts] = useState<Prisma.productsCreateInput[]>([])
  const [categories, setCategories] = useState<Prisma.categoriesCreateInput[]>([])
  const [reviewsApproved, setReviewsApproved] = useState<Prisma.reviewsCreateInput[]>([])
  const [reviewsUnapproved, setReviewsUnapproved] = useState<Prisma.reviewsCreateInput[]>([]);
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
      const reviewData = await fetch('/api/reviews').then(res => res.json())
      const reviewApprovedData = reviewData.reviews.filter((review: Prisma.reviewsCreateInput) => review.approved === true)
      const reviewUnapprovedData = reviewData.reviews.filter((review: Prisma.reviewsCreateInput) => review.approved === false)
      setReviewsApproved(reviewApprovedData)
      setReviewsUnapproved(reviewUnapprovedData)
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

  const renderSegments = () => {
    if(segmentType === 'pieces') {
      return (
        <>
        {
          products?.map(product =>
            <Product product={product} key={product.id} categories={categories} setProducts={setProducts}/>)
        }
        </>
      )
    }

    if(segmentType === 'categories') {
      return (
        <>
          {
            categories?.map(category =>
              <Category category={category} setCategories={setCategories} key={category.id}/>)
          }
        </>
      )
    }

    if(segmentType === 'reviews') {
      return (
        <>
          <h1 className='text-center text-2xl font-bold mb-4'>Reviews Needing Approval</h1>
          {
            reviewsUnapproved.length > 0 ? reviewsUnapproved.map(review =>
              <Review review={review} setApprovedReviews={setReviewsApproved} setUnapprovedReviews={setReviewsUnapproved} key={review.id}/>
            )
              :
              <h2 className='my-6 text-xl p-4'>No reviews need approval.</h2>
          }
          <h1 className='text-center text-2xl font-bold mb-4'>Approved Reviews</h1>
          {
            reviewsApproved.length > 0 ? reviewsApproved.map(review =>
              <Review review={review} setApprovedReviews={setReviewsApproved} setUnapprovedReviews={setReviewsUnapproved} key={review.id}/>
            )
              :
              <h2 className='my-6 text-xl p-4'>No approved reviews.</h2>
          }
        </>
      )
    }
  }

  return (
    <div className='pt-40 sm:pt-32 md:pt-24'>
    <nav className='flex flex-col md:flex-row justify-between items-center h-30  md:h-24 fixed top-0 w-full z-10 bg-black p-4'>
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
              {renderSegments()}
            </ul>
          </main>
      }
      <NewPieceModal isOpen={isNewPieceModalOpen} setIsOpen={setIsNewPieceModalOpen} setProducts={setProducts}/>
      <NewCategoryModal isOpen={isNewCategoryModalOpen} setIsOpen={setIsNewCategoryModalOpen} setCategories={setCategories} products={products}/>
    </div>
  )
}

export default Account