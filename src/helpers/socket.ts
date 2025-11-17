import { io, type Socket } from "socket.io-client";
import { API_URL } from "../config";

const URL: string = API_URL;

const socket = io(URL, { autoConnect: false, withCredentials: true });

// upon user login or refresh, connects to server side websocket
export const setUpSocket = (socket: Socket) => {
  socket.connect();

  socket.on("connect", () => {
    console.log("hello, you are connected");
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    socket.off("connect");
    socket.off("disconnect");
  });
};

export default socket;
