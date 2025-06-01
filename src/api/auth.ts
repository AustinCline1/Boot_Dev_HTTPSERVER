import {Request, Response} from "express";
import {BadRequestError, NotFoundError, UserNotAuthenticatedError} from "./errors.js";
import {
    getUserFromRefreshToken,
    getUserPassword,
    revokeRefreshToken,
    setRefreshToken,
    updateUser
} from "../db/queries/users.js";
import {checkPasswordHash, getBearerToken, hashPassword, makeJWT, makeRefreshToken, verifyJWT} from "../auth.js";
import {respondWithError, respondWithJSON} from "./json.js";
import {UserResponse} from "./users.js";
import {config} from "../config.js";


export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
    }
    type LoginUser = UserResponse & {
        token: string;
        refreshToken: string;
    }
    const params: parameters = req.body;
    const email = params.email;
    const password = params.password;
    if(!email || !password) {
        throw new BadRequestError("Missing required parameters, Need email and password");
    }
    const user = await getUserPassword(email);
    if(!user) {
        throw new UserNotAuthenticatedError("Email or password is incorrect");
    }

    const passwordMatch = await checkPasswordHash(password, user.password);
    if(!passwordMatch) {
        throw new UserNotAuthenticatedError("Email or password is incorrect");
    }
    const jwt = makeJWT(user.id,config.jwt.refreshDuration,config.jwt.secret);
    const refreshToken = makeRefreshToken();
    await setRefreshToken(user.id, refreshToken);
    respondWithJSON(res, 200,
        {   token: jwt,
            refreshToken: refreshToken,
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            isChirpyRed: user.isChirpyRed} satisfies LoginUser);
}

export async function handlerUpdateUser(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    }
    const token = getBearerToken(req);
    if(!token) {
        respondWithError(res, 401, "Invalid token");
    }
    const user = verifyJWT(token, config.jwt.secret);
    const parameters:parameters = req.body;
    const email = parameters.email;
    const password = parameters.password;
    if(!email || !password) {
        respondWithError(res, 400, "Missing required parameters, Need email and password");
    }
    if(!user) {
        throw new UserNotAuthenticatedError("Invalid token");
    }
    const hashedPassword = await hashPassword(password);
    if(!hashedPassword) {
        throw new Error("Failed to hash password");
    }
    const updatedUser = await updateUser(email,password,user);
    const userResponse: UserResponse = {
        id: updatedUser.id,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        email: updatedUser.email,
        isChirpyRed: updatedUser.isChirpyRed,
    }
    if(updatedUser) {
        respondWithJSON(res, 200, userResponse);
    }else {
        respondWithError(res, 401, "Failed to update user");
    }

}


export async function handlerRefresh(req: Request, res: Response) {
    const token = getBearerToken(req);
    if(!token) {
        respondWithError(res, 401, "Invalid token");
    }
    const user = await getUserFromRefreshToken(token);
    if(!user) {
        throw new UserNotAuthenticatedError("Invalid token");
    }
    if(user.revokedAt){
        throw new UserNotAuthenticatedError("Invalid token");
    }
    const jwt = makeJWT(user.userId, config.jwt.refreshDuration, config.jwt.secret);
    if(jwt) {
        respondWithJSON(res, 200, {token: jwt});
        return;
    }
        respondWithError(res, 401, "Invalid token");
        return;

}

export async function handlerRevoke(req: Request, res: Response) {
    const token = getBearerToken(req);
    if(!token) {
        respondWithError(res, 401, "Invalid Token");
    }
    console.log(`Revoking token ${token}`);
    await revokeRefreshToken(token);
    res.sendStatus(204);

}

export function getAPIKey(req: Request) {
    const apiKey = req.get("Authorization") as string;
    if(!apiKey){
        throw new UserNotAuthenticatedError("Missing API Key");
    }
    if(apiKey.split(" ").length !== 2) {
        throw new Error("Invalid API Key");
    }
    const [type, key] = apiKey.split(" ");
    if(type !== "ApiKey") {
        throw new Error("Invalid API Key");
    }
    return key;
}