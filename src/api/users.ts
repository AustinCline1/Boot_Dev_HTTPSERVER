import {Request, Response} from "express";
import {createUser} from "../db/queries/users.js";
import {respondWithJSON} from "./json.js";
import {BadRequestError} from "./errors.js";
import { hashPassword} from "../auth.js";
import {NewUser} from "../db/schema.js";
export type UserResponse = Omit<NewUser, "password">;

export async function handlerCreateUser(req: Request, res: Response) {
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
    const hashedPassword = await hashPassword(password);
    if(!hashedPassword) {
        throw new Error("Failed to hash password");
    }
    const user = await createUser({email: email, password: hashedPassword});
    const userResponse: UserResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
    }
    if (user) respondWithJSON(res, 201 , userResponse);
    else respondWithJSON(res, 400, {error: "User already exists"});
}
