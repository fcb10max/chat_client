export interface SignUpValues {
  username: string;
  password: string;
  email: string;
  verify_password: string;
}
export interface SignInValues {
  username: string;
  password: string;
}

export interface IUser {
  userID: number;
  username: string;
}
