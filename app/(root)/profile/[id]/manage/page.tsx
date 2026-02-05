
import { InterestsSection } from './_components/InterestSection'

import ProfileStatementCard from './_components/ProfileStatementCard'
import { EditProfileForm } from '@/components/forms/EditUserProfile'
import EditBtn from './_components/EditBtn'
import { getCurrentUser } from '@/actions/user.actions'
import { IUser } from '@/models/user.model'
import ProfileItems from '@/components/shared/navbars/ProfileItems'
import RightSidebar from '@/components/shared/navbars/RightSidebar'
import EmailVerificationBanner from './_components/EmailVerification'


const page = async() => {
  const result = await getCurrentUser()
  return (
    <div className='w-full bg-white'>
      
 <div className=' max-w-7xl gap-7 flex max-lg:flex-col mx-auto sm:py-6'>
 
  <ProfileItems />
        <RightSidebar />
    <div className='flex flex-col px-3 flex-1'>
 <div className='flex flex-col space-y-2.5'>
             <h2 className='capitalize font-bold text-black sm:text-3xl text-xl  '>Your profile</h2>
              <p className='text-sm text-gray-800 font-medium'>make changes to your personal information or account type</p>
        </div>
        <EmailVerificationBanner user={result.data?.user as IUser} />
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