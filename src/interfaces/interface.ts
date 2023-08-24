import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface JWTData extends JwtPayload {
  id: string;
}

export interface IRequest extends Request {
  user: string;
}
