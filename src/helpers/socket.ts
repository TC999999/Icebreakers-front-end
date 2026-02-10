import { io } from "socket.io-client";
import { API_URL } from "../config";

const URL: string = API_URL;

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
