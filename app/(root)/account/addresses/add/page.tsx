
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import AddAddressForm from '../../_components/AddAddressForm'

const page = () => {
  return (
    <div>
        <Link
          href="/account/addresses"
          className="text-sm text-blue-600 flex items-center gap-1 hover:text-orange-600 hover:underline mb-7 "
        >
          <ChevronLeft size={15} /> <span>Back to your addresses</span>
        </Link>
        <AddAddressForm />
    </div>
  )
}

export default page