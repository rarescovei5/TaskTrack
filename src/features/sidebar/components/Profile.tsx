import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';
import { ChevronsUpDown, User } from 'lucide-react';

const Profile = () => {
  const user = useAppSelector(selectCurrentUser)!;

  return (
    <div className="p-2 border border-border flex flex-row gap-2 rounded-md items-center relative pr-8">
      <div className="rounded-sm w-10 min-w-10 aspect-square overflow-hidden flex items-center justify-center">
        {user.profilePictureUrl ? (
          <img className="w-10 min-w-10" src={user.profilePictureUrl} alt="" />
        ) : (
          <div className="w-full h-full bg-border flex items-center justify-center">
            <User />
          </div>
        )}
      </div>
      <div className="flex flex-col overflow-hidden">
        <p className="truncate">{user.username}</p>
        <small className="text-muted truncate">
          {user.subscriptionPlan.toString().charAt(0).toUpperCase() +
            user.subscriptionPlan.toString().substring(1) +
            ' Plan'}
        </small>
      </div>

      <button className="cursor-pointer p-2 absolute top-1/2 -translate-y-1/2 right-0">
        <ChevronsUpDown size={16} />
      </button>
    </div>
  );
};

export default Profile;
