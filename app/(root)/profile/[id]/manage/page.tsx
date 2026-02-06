
import { InterestsSection } from './_components/InterestSection'

import ProfileStatementCard from './_components/ProfileStatementCard'
import { EditProfileForm } from '@/components/forms/EditUserProfile'
import EditBtn from './_components/EditBtn'
import { getCurrentUser } from '@/actions/user.actions'
import { IUser } from '@/models/user.model'
import ProfileItems from '@/components/shared/navbars/ProfileItems'
import RightSidebar from '@/components/shared/navbars/RightSidebar'
import EmailVerificationBanner from './_components/EmailVerification'


const page = async () => {
  const result = await getCurrentUser();
  const user = result.data?.user as IUser;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 sm:px-4 sm:py-8">
        {/* Navbars - Assuming these have fixed widths or flex-basis */}
        <ProfileItems />
        
        <main className="flex-1 max-sm:px-4 max-sm:py-5 sm:order-2 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col space-y-2 mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Account Settings
            </h1>
            <p className="text-gray-500 font-medium">
              Manage your personal information, security preferences, and interests.
            </p>
          </div>

          {/* Verification Banner - Only show if not verified */}
          {!user.isVerified && (
            <div className="transition-all duration-300 hover:scale-[1.01]">
               <EmailVerificationBanner user={user} />
            </div>
          )}

          {/* Security Section Card */}
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <ProfileStatementCard 
               title="Login & Security" 
               desc="Update your name, email, and password." 
            />
            <div className="p-6 border-t border-gray-100 bg-white">
              <EditProfileForm user={user} />
            </div>
          </section>

          {/* Interests Section Card */}
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <ProfileStatementCard 
               title="Interests" 
               desc="Personalize your feed based on your hobbies." 
            />
            <div className="p-6 border-t border-gray-100">
              <InterestsSection userSavedInterests={user.interests || []} />
            </div>
          </section>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
};
export default page