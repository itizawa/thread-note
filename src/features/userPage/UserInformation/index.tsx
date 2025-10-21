import { UserIcon } from "@/entities/user/UserIcon";

type Props = {
  user: {
    id: string;
    name: string | null;
    description: string | null;
    image: string | null;
    createdAt: Date;
    _count: {
      threads: number;
      posts: number;
    };
  };
};
export const UserInformation = ({ user }: Props) => {
  return (
    <div className="flex items-start space-x-4">
      <UserIcon size={12} className="max-w-[48px]" userImage={user.image} />
      <div className="flex flex-col space-y-2">
        <span className="text-gray-700 font-bold">{user.name}</span>
        <div className="flex flex-col space-y-1">
          {user.description && (
            <span className="text-sm text-gray-700 whitespace-normal">
              {user.description}
            </span>
          )}
          <div className="text-xs text-gray-500 flex space-x-4">
            <p>スレッド数: {user._count.threads}</p>
            <p>ポスト数: {user._count.posts}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
