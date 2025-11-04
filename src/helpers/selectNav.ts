const selectNav = (
  pathName: string,
  prev: string,
  username?: string
): string => {
  switch (pathName) {
    case "/conversations":
      return "conversations";
    case "/groups":
      return "groups";
    case "/groups/search":
      return "searchGroups";
    case "/user/search":
      return "searchUsers";
    case "/request":
      return "requests";
    case `/user/${username}`:
      return "userProfile";
    default:
      return prev;
  }
};

export default selectNav;
