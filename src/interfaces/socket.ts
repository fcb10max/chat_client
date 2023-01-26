import { Socket } from "socket.io-client";

export interface ServerToClientEvents {
}

export interface ClientToServerEvents {
}

export interface InterServerEvents {}

export interface SocketData {
  name: string;
  age: number;
}

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
