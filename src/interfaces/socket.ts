import { Socket } from "socket.io-client";
import { IConversation, IMessageFromDB } from "./message";

export interface ServerToClientEvents {
  "message:direct": (msgData: IMessageFromDB) => void;
  "newOnlineUser": (user: number) => void;
  "newOfflineUser": (user: number) => void;
}

export interface ClientToServerEvents {
  "message:direct": (
    msgData: {
      msg: string;
      from: number;
      to: number;
    },
    callback: (msg: IMessageFromDB, error: string) => void
  ) => void;
  "message:getAll": (
    users: { from: number; to: number },
    callback: (res: IMessageFromDB[], error: string) => void
  ) => void;
  "message:getAllConvs": (
    callback: (conversations: IConversation[], error: string) => void
  ) => void;
  "users:getSuggestions": (
    searchData: { username: string },
    callback: (suggs: { username: string; id: number }[], error: string) => void
  ) => void;
}

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
