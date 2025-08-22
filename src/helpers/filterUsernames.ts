const filterUsernames = (
  username: string,
  usernameList: string[],
  setter: React.Dispatch<React.SetStateAction<string[]>>,
  setShow: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  if (username) {
    let newUsernameList = usernameList.filter((val) => {
      return val.startsWith(username);
    });
    setter(newUsernameList);
    setShow(true);
  } else {
    setter([]);
    setShow(false);
  }
};

export default filterUsernames;
