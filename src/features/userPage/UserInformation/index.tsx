import { UserIcon } from "@/entities/user/UserIcon";

type Props = {
  user: {
    id: string;
    name: string | null;
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
    <div className="flex items-center space-x-4">
      <UserIcon size={12} userImage={user.image} />
      <div className="space-y-1">
        <h1>{user.name}</h1>
        <div className="text-xs text-gray-500 flex space-x-4">
          <p>スレッド数: {user._count.threads}</p>
          <p>ポスト数: {user._count.posts}</p>
        </div>
      </div>
    </div>
  );
};
