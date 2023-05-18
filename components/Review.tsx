import {Prisma} from "@prisma/client";
import React, {Dispatch, SetStateAction, useState} from "react";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";

interface ReviewProps {
  review: Prisma.reviewsCreateInput
  setApprovedReviews: Dispatch<SetStateAction<Prisma.reviewsCreateInput[]>>
  setUnapprovedReviews: Dispatch<SetStateAction<Prisma.reviewsCreateInput[]>>
}

const Review = ({review, setApprovedReviews, setUnapprovedReviews}: ReviewProps) => {

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false)

  const handleApproveReview = async () => {
    setIsApproveModalOpen(false);
    const response = await fetch(`/api/reviews/`, {method: 'PATCH', body: JSON.stringify({id: review.id, approved: true})})
    const data = await response.json()
    const updatedReview = data.review;
    setUnapprovedReviews(state => state.filter((item: Prisma.reviewsCreateInput) => item.id !== updatedReview.id))
    setApprovedReviews(state => state.concat(updatedReview))
  }

  const handleDenyReview = async () => {
    setIsDenyModalOpen(false);
    await fetch('/api/reviews/delete', {method: "POST", body: JSON.stringify({id: review.id})})
    setUnapprovedReviews(state => state.filter((item: Prisma.reviewsCreateInput) => item.id !== review.id))
  }

  return (
    <li className='p-4 border-b my-4'>
      <div className='font-bold my-4'>{review.author} - {review.email}</div>
      <div className='my-4'>{review.content}</div>
      {
        !review.approved &&
        <div className='flex justify-center'>
          <Button className='mx-4' onClick={() => setIsApproveModalOpen(true)}>
            Approve Review
          </Button>
          <Button onClick={() => setIsDenyModalOpen(true)}>
            Deny Review
          </Button>
        </div>
      }
      <ConfirmationModal
        onConfirm={handleApproveReview}
        onCancel={() => setIsApproveModalOpen(false)}
        isOpen={isApproveModalOpen} setIsOpen={setIsApproveModalOpen}
        message="Are you sure you want to approve this review? It will be immediately visible on the site."/>
      <ConfirmationModal
        onConfirm={handleDenyReview}
        onCancel={() => setIsDenyModalOpen(false)}
        isOpen={isDenyModalOpen}
        setIsOpen={setIsDenyModalOpen}
        message="Are you sure you want to deny this review? It will be permantely deleted."/>
    </li>
  )
}

export default Review