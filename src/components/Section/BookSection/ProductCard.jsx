'use client'
import React from 'react'
import { FaStar } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';



const ProductCard = ({item}) => {

  const  router = useRouter()
  return (
    
      <div className="w-full max-w-[280px] mx-auto cursor-pointer "  onClick={() => router.push(`/product/${item?.id}`)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          
          {/* Portrait-style Image */}
          <div className="w-full h-[360px] bg-gray-100 dark:bg-gray-700 relative">
            <img
              src={item?.images?.[0]?.url}
              alt={item?.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
  
          {/* Product Info */}
          <div className="px-4 py-4 space-y-2">
            {/* One-line Name */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {item.name}
            </h3>
  
            {/* Rating */}
            <div className="flex items-center text-sm gap-2">
              <FaStar className="text-yellow-400" />
              <span className="bg-blue-100 dark:bg-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                5.0
              </span>
            </div>
  
            {/* Price and CTA */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{item.price}
              </span>
              <Button
                onClick={() => router.push(`/product/${item?.id}`)}
                className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-4"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ProductCard
