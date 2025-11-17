// map of saved messages for each conversation; if a user clicks onto another conversation,
// this map saves any currently typed out messages in the input to the previous user; gets deleted
// if user refreshes page
const savedMessages = new Map<string, string>();

export default savedMessages;
