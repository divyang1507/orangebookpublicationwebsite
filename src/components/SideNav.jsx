import Link from 'next/link'
import React from 'react'

const SideNav = () => {
const data = [
  { name: "Dashboard", link: "/admin/dashboard" },
    { name: "Products", link: "/admin/products" },
    { name: "Orders", link: "/admin/orders" },
    { name: "Users", link: "/admin/users" },
    { name: "Settings", link: "/admin/settings" },
    { name: "Logout", link: "/admin/logout" },
]

    return (
    <div className='flex gap-4'>
      <div className='flex flex-col gap-2 bg-white shadow-md rounded-lg p-4'>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col gap-2 p-2 hover:bg-gray-200 cursor-pointer">
            <Link href={`${item.link}`} className="text-gray-700">{item.name}</Link>
          </div>
        ))}
      </div>
      <div>
      
      </div>
    </div>
  )
}

export default SideNav
