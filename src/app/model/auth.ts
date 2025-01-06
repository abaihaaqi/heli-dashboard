export interface User {
  username: string;
  name: string;
}

export interface RequestRegister extends User {
  password: string;
}

export interface RequestLogin {
  username: string;
  password: string;
}
