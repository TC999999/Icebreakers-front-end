// shortens the length of a new message to be added to respective conversation tab
const messageTruncate = (message: string): string => {
  if (message.length > 30) {
    return message.slice(0, 30) + "...";
  } else {
    return message;
  }
};

export default messageTruncate;
