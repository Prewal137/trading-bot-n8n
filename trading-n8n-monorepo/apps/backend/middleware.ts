import type { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
const JWT_SECRET = process.env.JWT_SECRET;
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"] || "";
   try {
    const response = jwt.verify(header, JWT_SECRET as string) as JwtPayload;
    if (response.id) {
        req.userId = response.id;
        next();
    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
   }
   catch(e){
    res.status(403).json({
        message: "You are not logged in"
    })
   }
}
