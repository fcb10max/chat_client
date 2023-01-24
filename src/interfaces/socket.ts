import { Socket } from "socket.io-client";
import { User } from "./user";

export interface ServerToClientEvents {
  newUserAdded: () => void;
  authError: (errMsg: string) => void;
}

export interface ClientToServerEvents {
  message: (msg: string) => void;
  newUser: (user: User) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  name: string;
  age: number;
}

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
