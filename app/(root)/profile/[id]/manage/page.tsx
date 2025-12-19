
import { InterestsSection } from './_components/InterestSection'

import ProfileStatementCard from './_components/ProfileStatementCard'
import { EditProfileForm } from '@/components/forms/EditUserProfile'
import EditBtn from './_components/EditBtn'
import { getCurrentUser } from '@/actions/user.actions'
import { IUser } from '@/models/user.model'


const page = async() => {
  const result = await getCurrentUser()
  return (
    <div className='w-full bg-white'>
      
 <div className=' max-w-7xl gap-7 flex max-lg:flex-col mx-auto py-6'>
  <div className='flex sm:flex-col max-sm:px-3 items-center sm:w-[250px] w-full  gap-2'>
    
        <img className='sm:w-[100px] w-[70px] h-[70px] sm:h-[100px] rounded-full object-contain '
         src={result.data?.user?.profilePictureUrl ?? "https://yt3.ggpht.com/MH9TWKPxjVZNjfGbZGLa9D71D-LVpTOPJbkh_abunMIfS6Mzqeh7M4c19eQdcp5i9dTQvIodUA=s48-c-k-c0x00ffffff-no-rj"} alt={result.data?.user?.fullName} />
    
    <EditBtn user={result.data?.user} />
  </div>
    <div className='flex flex-col px-3 flex-1'>
 <div className='flex flex-col space-y-2.5'>
             <h2 className='capitalize font-bold text-black sm:text-3xl text-xl  '>Your profile</h2>
              <p className='text-sm text-gray-800 font-medium'>Your profile preferences help us personalize recommendations for you.</p>
        </div>
         <div className='mt-5 flex flex-col space-y-4'>
           <ProfileStatementCard title='Login & security' desc='Edit login, name and mobile number' />
           <div>
             <EditProfileForm user={result.data?.user as IUser} />
           </div>
        </div>
        <div className='mt-5'>
           <ProfileStatementCard title='Interests' desc='Activities and hobbies' />
           <InterestsSection userSavedInterests={result.data?.user?.interests || []}  />
        </div>
        
    </div>
       
    </div>
   
    </div>
   
  )
}

export default page