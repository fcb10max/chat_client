import { Socket } from "socket.io-client";
import { IConversation, IMessageFromDB } from "./message";
import { IUser } from "./user";

declare module "socket.io-client" {
  interface Socket {
    username: string;
  }
}
export interface ServerToClientEvents {
  "message:direct": (msgData: IMessageFromDB) => void;
  // users: (users: IUser[]) => void;
}

export interface ClientToServerEvents {
  "message:direct": (
    msgData: {
      msg: string;
      from: number;
      to: number;
    },
    callback: (msg: IMessageFromDB) => void
  ) => void;
  "message:getAll": (
    users: { from: number; to: number },
    callback: (res: IMessageFromDB[]) => void
  ) => void;
  "message:getAllConvs": (
    callback: (conversations: IConversation[]) => void
  ) => void;
  "users:getSuggestions": (
    searchData: { username: string },
    callback: (suggs: {username: string, id: number}[]) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  name: string;
  age: number;
}

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
