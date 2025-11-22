"use client"
import { ROUTES } from '@/constants/routes'
import Link from 'next/link'
import React, {useState} from 'react'
import ConfirmationModal from '../ConfirmationModal'
import { IAddress } from '@/models/address.model'
import { removeAddressAction, setDefaultAddressAction } from '@/actions/address.actions'
import { toast } from 'sonner'

const RemoveAddressBtn = ({address}:{address: IAddress}) => {
    const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false)
    const [addressToDelete,setAddressToDelete] = useState<IAddress | null>(address)
    const [pending,setPending] = useState(false)
    const confirmRemoveAddress = async()=> {

       try {
        setPending(true)
         const { error, success } = await removeAddressAction({id:address._id})
         if(error) {
            toast.error(error.message)
            return
         }else if(success) {
             toast.success("Address removed ")
             setIsDeleteModalOpen(false)
             return
         }
       } catch (error) {
          console.log(error)
       } finally {
        setPending(false)
       }
    }
    const handleSetToDefault = async(id:string)=> {
        try {
            const { error } = await setDefaultAddressAction({id})
            if(error) {
                toast.error(error.message)
                return
            }
        } catch (error) {
             console.log(error)
        }
    }
  return (
    <div className="mt-4 pt-4 flex space-x-3 text-sm">
                            <Link href={ROUTES.editAddress(address._id)} className="text-blue-600 hover:text-orange-600 hover:underline">Edit</Link>
                            <span className="text-gray-300">|</span>
                            <button onClick={()=> setIsDeleteModalOpen(true)} className="text-blue-600 hover:text-orange-600 hover:underline">Remove</button>
                            {!address.isDefault && (
                                <>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={()=> handleSetToDefault(address._id)} className="text-blue-600 cursor-pointer hover:text-orange-600 hover:underline">Set as Default</button>
                                </>
                            )}
                            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setAddressToDelete(null);
                }}
                isPending={pending}
                onConfirm={confirmRemoveAddress}
                title="Delete Address"
                message={`Are you sure you want to remove the address for ${addressToDelete?.name} at ${addressToDelete?.addressLine1}? This action cannot be undone.`}
                confirmText="Delete"
            />
                        </div>
  )
}

export default RemoveAddressBtn