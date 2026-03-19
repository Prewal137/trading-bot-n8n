import type { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"] || "";
    console.log("Auth Header:", authHeader);

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            message: "You are not logged in"
        });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "";
    console.log("Middleware JWT_SECRET length:", secret.length);

    try {
        const payload = jwt.verify(token, secret) as JwtPayload;
        console.log("Decoded Token Payload:", payload);

        if (payload.id) {
            req.userId = payload.id;
            next();
        } else {
            console.log("Payload missing 'id' field");
            res.status(403).json({
                message: "Invalid token"
            });
        }
    } catch (e: any) {
        console.error("JWT Verify Error:", e.message);
        res.status(403).json({
            message: "Invalid token"
        });
    }
}
