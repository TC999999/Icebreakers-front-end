import UserSearchCardSkeleton from "./UserSearchCardSkeleton";
type Props = { cards: number };

const UserSearchSkeleton: React.FC<Props> = ({ cards }) => {
  return Array(cards)
    .fill(0)
    .map((_, i) => <UserSearchCardSkeleton key={`skeleton-user-${i}`} />);
};

export default UserSearchSkeleton;
