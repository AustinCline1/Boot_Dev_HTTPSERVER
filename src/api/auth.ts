import {Request, Response} from "express";
import {BadRequestError, UserNotAuthenticatedError} from "./errors.js";
import {getUserPassword} from "../db/queries/users.js";
import {checkPasswordHash} from "../db/auth.js";
import {respondWithJSON} from "./json.js";
import {UserResponse} from "./users.js";

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
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
    const userResponse: UserResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
    }
    respondWithJSON(res, 200, userResponse);
}