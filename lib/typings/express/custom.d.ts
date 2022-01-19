declare namespace Express {
  export interface Request {
    user?: import('quoti-auth').UserData;
  }
}
