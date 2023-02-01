import { Socket } from "socket.io-client";
import { IConversation, IMessageFromDB } from "./message";
import { IUser } from "./user";

declare module "socket.io-client" {
  interface Socket {
    username: string;
  }
}
export interface ServerToClientEvents {
  "message:direct": (msgData: {
    msg: string;
    from: number;
    to: number;
  }) => void;
  users: (users: IUser[]) => void;
  "message:getAll": (messages: IMessageFromDB[]) => void;
  "message:getAllConvs": (convs: IConversation[]) => void;
}

export interface ClientToServerEvents {
  "message:direct": (msgData: {
    msg: string;
    from: number;
    to: number;
  }) => void;
  "message:getAll": (users: { from: number; to: number }) => void;
  "message:getAllConvs": () => void;
}

export interface InterServerEvents {}

export interface SocketData {
  name: string;
  age: number;
}

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
