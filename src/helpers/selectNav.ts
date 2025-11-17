// helper function for nav bar to switch which navbar link should be highlighted based on current
// location path name
const selectNav = (pathName: string, username?: string): string => {
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
      return "none";
  }
};

export default selectNav;
