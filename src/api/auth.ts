import {Request, Response} from "express";
import {BadRequestError, UserNotAuthenticatedError} from "./errors.js";
import {getUserPassword} from "../db/queries/users.js";
import {checkPasswordHash, makeJWT} from "../auth.js";
import {respondWithJSON} from "./json.js";
import {UserResponse} from "./users.js";
import {config} from "../config.js";


export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
        expiresInSeconds?: number;
    }
    const params: parameters = req.body;
    const email = params.email;
    const password = params.password;
    const expires = params.expiresInSeconds? Math.min(params.expiresInSeconds, 3600) : 3600;
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
    const jwt = makeJWT(user.id,expires,config.api.secret);
    const userResponse: UserResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,

    }
    respondWithJSON(res, 200, {userResponse, token: jwt});
}