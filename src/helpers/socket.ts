import { io } from "socket.io-client";
import { API_URL } from "../config";

const URL: string = API_URL;

// socket instance that listens for signals from backend server
const socket = io(URL, { autoConnect: false, withCredentials: true });

//socket connects
socket.on("connect", () => {
  console.log("hello, you are connected");
});

// when socket disconnects, cleans up socket event listeners
socket.on("disconnect", () => {
  console.log("disconnected");
  socket.off("connect");
  socket.off("disconnect");
});

export default socket;
