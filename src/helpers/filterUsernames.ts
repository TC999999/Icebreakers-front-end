// helper function for user search bar to filter out users based on current search query
const filterUsernames = (
  username: string,
  usernameList: string[],
): string[] => {
  const newUsernameList = usernameList.filter((val) => {
    return val.startsWith(username);
  });

  return newUsernameList;
};

export default filterUsernames;
