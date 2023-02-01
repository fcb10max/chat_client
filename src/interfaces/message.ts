export interface IMessageFromDB {
  from: number,
  to: number,
  created: number,
  content: string,
  message_id: number
}

export interface IRenderMessage {
  from: number,
  created: number,
  content: string,
}

export interface IConversation {
  user: {id: number, username: string} ;
  lastMsg: IMessageFromDB;
}