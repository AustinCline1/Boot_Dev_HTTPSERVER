import bcrypt from "bcrypt";
import {JwtPayload} from "jsonwebtoken";
import jwt from "jsonwebtoken";
import {UserNotAuthenticatedError} from "./api/errors.js";
import {Request} from "express";
import {randomBytes} from "node:crypto";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
const TOKEN_ISSUER = "chirpy"


export async function hashPassword(password:string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    if(!hashedPassword) {
        return "";
    }else {
        return hashedPassword
    }
}

export function checkPasswordHash(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt= issuedAt + expiresIn;
    const token =  jwt.sign({
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: issuedAt,
        exp: expiresAt,
    } satisfies payload, secret, {algorithm: "HS256"});
    return token;
}

export function verifyJWT(tokenString: string, secret: string): string {
    let token:payload
    try {
        token = jwt.verify(tokenString, secret) as JwtPayload;
    }catch (e) {
        throw new UserNotAuthenticatedError("Invalid token");
    }
    if(token.iss != TOKEN_ISSUER) {
        throw new UserNotAuthenticatedError("Invalid token");
    }
    if(!token.sub) {

        throw new UserNotAuthenticatedError("Invalid token");
    }
    return token.sub;
}


export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");
    if(!authHeader) {
        throw new UserNotAuthenticatedError("Missing token");
    }
    const token = authHeader.split(" ");
    if(token.length < 2 || token[0] !== "Bearer") {
        throw new UserNotAuthenticatedError("Missing token");
    }
    if(!token) {
        throw new UserNotAuthenticatedError("Missing token");
    }
    const extractedToken = token[1];
    return extractedToken;
}

export function makeRefreshToken() {
    return randomBytes(32).toString("hex");
}