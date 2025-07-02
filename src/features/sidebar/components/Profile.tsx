import { ChevronsUpDown, User } from 'lucide-react';
import { useUser } from '../../auth/UserProvider';

const Profile = () => {
  const { email, fullName, profilePictureUrl } = useUser().user;
  return (
    <div className="p-2 border border-border flex flex-row gap-2 rounded-md items-center relative pr-8">
      <div className="rounded-sm w-10 min-w-10 aspect-square overflow-hidden flex items-center justify-center">
        {profilePictureUrl ? (
          <img className="w-10 min-w-10" src={profilePictureUrl} alt="" />
        ) : (
          <div className="w-full h-full bg-border flex items-center justify-center">
            <User />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 overflow-hidden">
        <p className="truncate">{fullName || 'Anonymous'}</p>
        <small className="text-muted truncate">{email || 'No Email'}</small>
      </div>

      <button className="cursor-pointer p-2 absolute top-1/2 -translate-y-1/2 right-0">
        <ChevronsUpDown size={16} />
      </button>
    </div>
  );
};

export default Profile;
