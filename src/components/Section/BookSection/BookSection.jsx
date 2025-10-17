"use client"
import { useProduct } from '@/context/ProductContext'
import React from 'react'

const BookSection = () => {
    const {books} = useProduct()
    console.log(books)
  return (
    <div>
         <h1 className="text-3xl font-semibold pb-8 text-center">Featured Books</h1>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"> */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((item) => (
            console.log(item),
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default BookSection
