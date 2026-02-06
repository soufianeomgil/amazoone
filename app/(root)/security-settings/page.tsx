
import ProfileItems from '@/components/shared/navbars/ProfileItems';
import RightSidebar from '@/components/shared/navbars/RightSidebar';
import React from 'react';
import { auth } from '@/auth';
import DeleteAccountBtn from './_components/DeleteAccountBtn';

const page = async() => {
 



const session = await auth()
  // TODO: CREATE A SERVER ACTION FOR DELETING ACCOUNT
  // TODO: SEND A CONFIRMATION EMAIL TO USER WHO WANTS TO DELETE THEIR ACCOUNT
    return (
        <div className="min-h-screen w-full bg-gray-50 lg:px-10 lg:py-8">
             <div className=" flex lg:flex-row flex-col  gap-5">
              <ProfileItems />
              <RightSidebar />
         <div className="flex-1 p-4 w-full lg:px-3">
              <h2 className='font-bold text-black text-2xl mb-3 '>Security Settings</h2>
              <div className='bg-white rounded-lg shadow-sm px-3 py-5 space-x-2 flex items-start '>
                   <img src="https://f.nooncdn.com/s/app/com/noon/icons/SecuritySettingsTrashIcon.svg" alt="trash icon" />
                   <div className="flex flex-col">
                      <h3 className="text-[16px] font-semibold text-black">Account Deletion</h3>
                      <p className='text-gray-500 text-sm font-normal '>We are sad to see you go, but hope to see you again!</p>
                       {/* THIS BTN SHOULD GO TO CLIENT COMPONENT */}
                      <DeleteAccountBtn />
                   </div>
              </div>
         </div>
 
        </div>
            
        </div>
       
      
    );
};

export default page