import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import auth from "../../../config/auth";
import { getUserProfile } from "../../../firebase/services/Users";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({
        message: "Token is missing"
    })
  }

  const [, token] = authToken.split(" ");

  try {
    const { sub: user_id } = verify(token, auth.secret_token);
    const user = await getUserProfile(user_id+'');
    if( user.isAdmin ) {
        next();
    } else {
      return response.status(401).json({
        message: "User is not an admin or token invalid"
      })
    }
  } catch(err) {
    return response.status(401).json({
        message: "Token is invalid or expired"
    })
  } 
}
